import React, {Component} from 'react'
import {
    Image,
    ImageBackground,
    StyleSheet,
    Dimensions,
    TouchableWithoutFeedback,
} from 'react-native'

export default class ImageItem extends Component {

    static defaultProps = {
        item: {},
        selected: false,
    }

    render() {
        let {item, selected, selectedMarker, columnWidth } = this.props
        let marker = selectedMarker ? selectedMarker :
            <Image
                style={[styles.marker, {width: 25, height: 25}]}
                source={require('./selected.png')}
            />

        let image = {...item}

        return (
            <TouchableWithoutFeedback
                onPress={this._handlePress.bind(this, image)}>
                <ImageBackground
                    source={{uri: image.uri}}
                    style={{margin: 1, height: columnWidth - 2, width: columnWidth - 2,}} >
                    { (selected) ? marker : null }
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
}
