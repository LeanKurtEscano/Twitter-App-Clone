import React from 'react';
import { View, Text, TouchableOpacity, Modal } from 'react-native';
import { Feather } from '@expo/vector-icons';


interface RetweetModalProps {
  isVisible?: boolean;
  onClose?: () => void;
  onRepost?: () => void;
  onQuote?: () => void;

  isRetweeted?: boolean;
}

export const RetweetModal = ({ isVisible = false, onClose, onRepost, onQuote, isRetweeted }: RetweetModalProps) => {
  return (
    <Modal
      visible={isVisible}
      transparent={true}
      animationType="slide"
      onRequestClose={onClose}
    >
      {/* Backdrop */}
      <TouchableOpacity 
        className="flex-1 bg-black/50 justify-end"
        onPress={onClose}
        activeOpacity={1}
      >
       
        <TouchableOpacity 
          className="bg-white rounded-t-2xl shadow-xl w-full overflow-hidden"
          activeOpacity={1}
        >
          <View className="py-7 ">
            {isRetweeted ? (
             <TouchableOpacity
              className="flex-row items-center px-8 py-6"
              onPress={() => {
                onRepost?.();
                onClose?.();
              }}
              activeOpacity={0.7}
            >
              <View className="mr-6">
                <Feather name="repeat" size={28} color="red" />
              </View>
              <View>
                <Text className="text-red-500 font-medium text-lg">Undo Repost</Text>
              </View>
            </TouchableOpacity>
            ) : (
              <TouchableOpacity
              className="flex-row items-center px-8 py-6"
              onPress={() => {
                onRepost?.();
                onClose?.();
              }}
              activeOpacity={0.7}
            >
              <View className="mr-6">
                <Feather name="repeat" size={28} color="#374151" />
              </View>
              <View>
                <Text className="text-gray-900 font-medium text-lg">Repost</Text>
              </View>
            </TouchableOpacity>
            )}
          

          
            <View className="border-t border-gray-100 mx-8" />

           
            <TouchableOpacity
              className="flex-row items-center px-8 py-6"
              onPress={() => {
                onQuote?.();
                onClose?.();
              }}
              activeOpacity={0.7}
            >
              <View className="mr-6">
                <Feather name="edit-3" size={28} color="#374151" />
              </View>
              <View>
                <Text className="text-gray-900 font-medium text-lg">Quote</Text>
              </View>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </TouchableOpacity>
    </Modal>
  );
};
