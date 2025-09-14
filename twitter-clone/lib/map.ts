import {Driver, MarkerData} from "@/types/type";

// Using OSRM public demo server - consider hosting your own for production
const OSRM_BASE_URL = "https://router.project-osrm.org/route/v1/driving";

export const generateMarkersFromData = ({
                                            data,
                                            userLatitude,
                                            userLongitude,
                                        }: {
    data: Driver[];
    userLatitude: number;
    userLongitude: number;
}): MarkerData[] => {
    return data.map((driver) => {
        const latOffset = (Math.random() - 0.5) * 0.01; // Random offset between -0.005 and 0.005
        const lngOffset = (Math.random() - 0.5) * 0.01; // Random offset between -0.005 and 0.005

        return {
            latitude: userLatitude + latOffset,
            longitude: userLongitude + lngOffset,
            title: `${driver.first_name} ${driver.last_name}`,
            ...driver,
        };
    });
};

export const calculateRegion = ({
                                    userLatitude,
                                    userLongitude,
                                    destinationLatitude,
                                    destinationLongitude,
                                }: {
    userLatitude: number | null;
    userLongitude: number | null;
    destinationLatitude?: number | null;
    destinationLongitude?: number | null;
}) => {
    if (!userLatitude || !userLongitude) {
        return {
            latitude: 37.78825,
            longitude: -122.4324,
            latitudeDelta: 0.01,
            longitudeDelta: 0.01,
        };
    }

    if (!destinationLatitude || !destinationLongitude) {
        return {
            latitude: userLatitude,
            longitude: userLongitude,
            latitudeDelta: 0.01,
            longitudeDelta: 0.01,
        };
    }

    const minLat = Math.min(userLatitude, destinationLatitude);
    const maxLat = Math.max(userLatitude, destinationLatitude);
    const minLng = Math.min(userLongitude, destinationLongitude);
    const maxLng = Math.max(userLongitude, destinationLongitude);

    const latitudeDelta = (maxLat - minLat) * 1.3; // Adding some padding
    const longitudeDelta = (maxLng - minLng) * 1.3; // Adding some padding

    const latitude = (userLatitude + destinationLatitude) / 2;
    const longitude = (userLongitude + destinationLongitude) / 2;

    return {
        latitude,
        longitude,
        latitudeDelta,
        longitudeDelta,
    };
};

// Helper function to get route data from OSRM
const getOSRMRoute = async (startLng: number, startLat: number, endLng: number, endLat: number) => {
    const url = `${OSRM_BASE_URL}/${startLng},${startLat};${endLng},${endLat}?overview=false&steps=false`;

    const response = await fetch(url);
    if (!response.ok) {
        throw new Error(`OSRM API error: ${response.status}`);
    }

    const data = await response.json();
    if (data.code !== 'Ok' || !data.routes || data.routes.length === 0) {
        throw new Error('No route found');
    }

    return {
        duration: data.routes[0].duration, // Duration in seconds
        distance: data.routes[0].distance  // Distance in meters
    };
};

export const calculateDriverTimes = async ({
                                               markers,
                                               userLatitude,
                                               userLongitude,
                                               destinationLatitude,
                                               destinationLongitude,
                                           }: {
    markers: MarkerData[];
    userLatitude: number | null;
    userLongitude: number | null;
    destinationLatitude: number | null;
    destinationLongitude: number | null;
}) => {
    if (
        !userLatitude ||
        !userLongitude ||
        !destinationLatitude ||
        !destinationLongitude
    )
        return;

    try {
        const timesPromises = markers.map(async (marker) => {
            // Get route from driver to user
            const routeToUser = await getOSRMRoute(
                marker.longitude,
                marker.latitude,
                userLongitude,
                userLatitude
            );

            // Get route from user to destination
            const routeToDestination = await getOSRMRoute(
                userLongitude,
                userLatitude,
                destinationLongitude,
                destinationLatitude
            );

            const totalTime = (routeToUser.duration + routeToDestination.duration) / 60; // Total time in minutes
            const totalDistance = (routeToUser.distance + routeToDestination.distance) / 1000; // Total distance in km
            const price = (totalTime * 0.5).toFixed(2); // Calculate price based on time

            return {
                ...marker,
                time: totalTime,
                price,
                distance: totalDistance
            };
        });

        return await Promise.all(timesPromises);
    } catch (error) {
        console.error("Error calculating driver times:", error);
        return markers; // Return original markers if calculation fails
    }
};