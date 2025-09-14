import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import MapView, { Marker, PROVIDER_DEFAULT } from 'react-native-maps';
import { useLocationStore } from '../store/locationStore'; // Adjust import path as needed
import { useDriverStore } from '../store/driverStore'; // Adjust import path as needed

// Sample drivers data - replace with your actual data source
const drivers = [
    {
        id: "1",
        first_name: "James",
        last_name: "Wilson",
        profile_image: "https://ucarecdn.com/dae59f69-2c1f-48c3-a883-017bcf0f9950/-/preview/1000x666/",
        car_image: "https://ucarecdn.com/a2dc52b2-8bf5-4e49-9b15-eea1d80d9c6f/-/preview/465x466/",
        car_seats: 4,
        rating: "4.80",
        latitude: 37.78825,
        longitude: -122.4324,
    },
    {
        id: "2",
        first_name: "David",
        last_name: "Brown",
        profile_image: "https://ucarecdn.com/6ea6d83d-ef1a-483f-9106-837a3a5b3f67/-/preview/1000x666/",
        car_image: "https://ucarecdn.com/a3872f80-c094-409c-82f8-c9ff38429327/-/preview/930x932/",
        car_seats: 5,
        rating: "4.60",
        latitude: 37.78845,
        longitude: -122.4344,
    },
    {
        id: "3",
        first_name: "Michael",
        last_name: "Johnson",
        profile_image: "https://ucarecdn.com/0330d85c-232e-4c30-bd04-e5e4d0e3d688/-/preview/826x822/",
        car_image: "https://ucarecdn.com/289764fb-55b6-4427-b1d1-f655987b4a14/-/preview/930x932/",
        car_seats: 4,
        rating: "4.70",
        latitude: 37.78865,
        longitude: -122.4364,
    },
    {
        id: "4",
        first_name: "Robert",
        last_name: "Green",
        profile_image: "https://ucarecdn.com/fdfc54df-9d24-40f7-b7d3-6f391561c0db/-/preview/626x417/",
        car_image: "https://ucarecdn.com/b197e113-dfb0-4bd2-872b-b3282f65c137/-/preview/930x932/",
        car_seats: 4,
        rating: "4.90",
        latitude: 37.78790,
        longitude: -122.4340,
    }
];

const Map = () => {
    // Get location data from store
    const {
        userLatitude,
        userLongitude,
        userAddress,
        destinationLatitude,
        destinationLongitude,
        destinationAddress
    } = useLocationStore();

    // Get selected driver from store
    const { selectedDriver, setSelectedDriver } = useDriverStore();

    // Default region (fallback if no user location)
    const defaultRegion = {
        latitude: 37.78825,
        longitude: -122.4324,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
    };

    // Use user location if available, otherwise use default
    const mapRegion = (userLatitude !== null && userLongitude !== null) ? {
        latitude: userLatitude,
        longitude: userLongitude,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
    } : defaultRegion;

    // Function to get marker color based on selection
    const getDriverMarkerColor = (driverId) => {
        return selectedDriver === driverId ? "green" : "blue";
    };

    // Handle driver selection
    const handleDriverPress = (driver) => {
        setSelectedDriver(driver.id);
        console.log(`Selected driver: ${driver.first_name} ${driver.last_name} (ID: ${driver.id})`);
    };

    return (
        <View style={styles.container}>
            <MapView
                provider={PROVIDER_DEFAULT}
                style={styles.map}
                region={mapRegion}
                showsUserLocation={true}
                showsMyLocationButton={true}
            >
                {/* User Location Marker */}
                {(userLatitude !== null && userLongitude !== null) && (
                    <Marker
                        coordinate={{
                            latitude: userLatitude,
                            longitude: userLongitude,
                        }}
                        title="Your Location"
                        description={userAddress || "Current location"}
                        pinColor="orange"
                        identifier="user-location"
                    />
                )}

                {/* Destination Marker */}
                {(destinationLatitude !== null && destinationLongitude !== null) && (
                    <Marker
                        coordinate={{
                            latitude: destinationLatitude,
                            longitude: destinationLongitude,
                        }}
                        title="Destination"
                        description={destinationAddress || "Destination"}
                        pinColor="red"
                        identifier="destination"
                    />
                )}

                {/* Driver Markers */}
                {drivers.map((driver) => (
                    <Marker
                        key={driver.id}
                        coordinate={{
                            latitude: driver.latitude,
                            longitude: driver.longitude,
                        }}
                        title={`${driver.first_name} ${driver.last_name}`}
                        description={`Rating: ${driver.rating} ⭐ • ${driver.car_seats} seats`}
                        pinColor={getDriverMarkerColor(driver.id)}
                        identifier={`driver-${driver.id}`}
                        onPress={() => handleDriverPress(driver)}
                    />
                ))}
            </MapView>

            {/* Loading state overlay */}
            {drivers.length === 0 && (
                <View style={styles.overlay}>
                    <Text style={styles.overlayText}>Loading drivers...</Text>
                </View>
            )}

            {/* Selected driver info overlay */}
            {selectedDriver && (
                <View style={styles.selectedDriverOverlay}>
                    {(() => {
                        const driver = drivers.find(d => d.id === selectedDriver);
                        return driver ? (
                            <Text style={styles.selectedDriverText}>
                                Selected: {driver.first_name} {driver.last_name} ({driver.rating}⭐)
                            </Text>
                        ) : null;
                    })()}
                </View>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        width: '100%',
        height: '100%',
    },
    map: {
        width: '100%',
        height: '100%',
    },
    overlay: {
        position: 'absolute',
        top: 50,
        left: 20,
        right: 20,
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        padding: 10,
        borderRadius: 5,
        alignItems: 'center',
    },
    overlayText: {
        color: 'white',
        fontSize: 14,
    },
    selectedDriverOverlay: {
        position: 'absolute',
        bottom: 100,
        left: 20,
        right: 20,
        backgroundColor: 'rgba(0, 128, 0, 0.9)',
        padding: 15,
        borderRadius: 10,
        alignItems: 'center',
    },
    selectedDriverText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
    },
});

export default Map;