import React, {Component} from 'react'
import {
  Image,
  ImageBackground,
  StyleSheet,
  Dimensions,
  TouchableWithoutFeedback,
  View,
  Text
} from 'react-native'

export default class ImageItem extends Component {

    static defaultProps = {
        item: {},
        selected: false,
    }

    render() {
        let {item, selected, selectedMarker, columnWidth, index } = this.props
        let marker = selectedMarker ? selectedMarker :
            <View
                style={[styles.marker, {
                  width: 18,
                  height: 18,
                  borderRadius: 18/2,
                  borderColor: 'white',
                  borderWidth: 1,
                  justifyContent: 'center',
                  alignItems: 'center'
                }, selected ? { backgroundColor: '#75c5ef' } : {}]}
            >
            {
              selected &&
              <Text style={{ color: 'white' }}>
                {index}
              </Text>
            }
            </View>

        let image = {...item}

        return (
            <TouchableWithoutFeedback
                onPress={this._handlePress.bind(this, image)}>
                <ImageBackground
                    source={{uri: image.uri}}
                    style={{margin: 1, height: columnWidth - 2, width: columnWidth - 2,}} >
                    { marker }
                </ImageBackground>
            </TouchableWithoutFeedback>
        )
    }

    _handlePress(item) {
        this.props.onPress(item)
    }
}

const styles = StyleSheet.create({
    marker: {
        position: 'absolute',
        top: 5,
        right: 5,
        backgroundColor: 'transparent',
    },
})
