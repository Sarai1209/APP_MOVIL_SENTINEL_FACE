import React from 'react';
import {
  StyleProp,
  StyleSheet,
  TextInput,
  TextInputProps,
  TouchableOpacity,
  View,
  ViewStyle,
} from 'react-native';
import { Colors } from '../../constants/theme';

interface Props extends TextInputProps {
  icon:            React.ReactNode;
  rightElement?:   React.ReactNode;
  containerStyle?: StyleProp<ViewStyle>;  
}

export default function InputField({ icon, rightElement, containerStyle, ...rest }: Props) {
  return (
    <View style={[styles.wrap, containerStyle]}>  
      <View style={styles.iconWrap}>{icon}</View>
      <TextInput
        style={styles.input}
        placeholderTextColor={Colors.dark.textSubtle}
        {...rest}
      />
      {rightElement && (
        <TouchableOpacity style={styles.right}>{rightElement}</TouchableOpacity>
      )}
    </View>
  );
}
 
const styles = StyleSheet.create({
  wrap: {
    flexDirection:   'row',
    alignItems:      'center',
    backgroundColor: Colors.dark.surface,
    borderRadius:    12,
    borderWidth:     1,
    borderColor:     Colors.dark.border,
    paddingHorizontal: 14,
    height:          52,
  },
  iconWrap: { marginRight: 10 },
  input: {
    flex:     1,
    color:    Colors.dark.text,
    fontSize: 15,
  },
  right: { padding: 6 },
});