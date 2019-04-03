/*
 * A smart react native component providing images selection from camera roll for android and ios, written in JS
 * https://github.com/julian-1503/react-native-smart-camera-roll-picker/
 * Released under the MIT license
 * Copyright (c) 2018 react-native-component <juliandeveloper1503@gmail.com>
 */

import React, {Component} from 'react'
import {
    StyleSheet,
    View,
    Text,
    ListView,
    ActivityIndicator,
    Dimensions,
    FlatList
} from 'react-native'
import ImageView from './ImageView'
import PullToRefreshListView from 'react-native-smart-pull-to-refresh-listview'

import GalleryManager from 'react-native-gallery-manager'

const {width: deviceWidth} = Dimensions.get('window')

export default class CameraRollPicker extends Component {

  static defaultProps = {
    onEndReachedThreshold: 0.8,
    fetchSize: 90,
    maximum: 8,
    columnCount: 3,
    assetType: 'all',
    selected: [],
    onSelect: (selectedImages, currentImage) => {},
    getFirstPhoto: () => {},
    onMaximumReached: () => {}
  }

  constructor(props) {
    super(props)

    let {rowWidth, columnCount, selected} = props

    this.state = {
      images: [],
      noMore: false,
      next: 0,
      refreshing: false,
      initial: true,
      selected: new Set()
    }

    this._renderImage = this._renderImage.bind(this)
    this._fetch = this._fetch.bind(this)
    this._renderFooter = this._renderFooter.bind(this)
    this._columnWidth = (rowWidth || deviceWidth) / columnCount
  }

  shouldComponentUpdate (nextProps, nextState) {
    let shouldUpdate = (
      this.state.refreshing !== nextState.refreshing ||
      this.state.next !== nextState.next ||
      this.state.noMore !== nextState.noMore ||
      this.state.images !== nextState.images ||
      this.props.onEndReachedThreshold !== nextProps.onEndReachedThreshold ||
      this.props.maximum !== nextProps.maximum ||
      this.props.selected !== nextProps.selected ||
      this.props.assetType !== nextProps.assetType ||
      this.props.maximum !== nextProps.maximum ||
      this.props.columnCount !== nextProps.columnCount ||
      this.props.fetchSize !== nextProps.fetchSize ||
      this.state.initial !== nextState.initial ||
      this.state.selected.size !== nextState.selected.size
    )

    return shouldUpdate
  }

  componentDidMount () {
    this._fetch()
  }

  async _fetch() {
    let _this = this
    let {groupTypes, assetType, fetchSize, getFirstPhoto} = _this.props
    let {noMore, next, refreshing, initial} = _this.state

    if (refreshing) {
      return null
    }

    let fetchParams = {
      limit: fetchSize,
      type: assetType,
      startFrom: next
    }


    try {
      if (initial) {
        let firstPhotoAssets = await GalleryManager.getAssets({ limit: 1, startFrom: 0, type: assetType })
        getFirstPhoto(firstPhotoAssets.assets[0])
      }

      this.setState({
        initial: false
      }, async () => {
        let photos = await GalleryManager.getAssets(fetchParams)
        _this._appendImages(photos)
      })
    }
    catch(e) {
      console.log(e)
    }
    finally {
      this.setState({ refreshing: false })
    }
  }

  _appendImages(data) {
    let { images } = this.state
    let { assets, hasMore, next, totalAssets } = data
    let newState = {}

    if (!hasMore) {
        newState.noMore = true
    }

    if (assets.length > 0) {
        newState.lastCursor = totalAssets
        newState.next = next
        newState.images = images.concat(assets)
        newState.refreshing = false
    }

    this.setState(newState)
  }

  render() {
    let {
        initialListSize,
        pageSize,
        onEndReachedThreshold,
        columnCount
    } = this.props
    let { images, refreshing } = this.state

    return (
      <FlatList
        data={images}
        renderItem={this._renderImage}
        numColumns={columnCount}
        keyExtractor={(item, index)=> `${item.uri}__${index}`}
        style={styles.container}
        onEndReachedThreshold={onEndReachedThreshold}
        onEndReached={this._fetch}
        refreshing={refreshing}
        ListFooterComponent={this._renderFooter}
        extraData={this.state.selected.size}
      />
    )
  }

  _renderImage({ item, index }) {
    let {
        selectedMarker,
    } = this.props

    let uri = item.uri

    let isSelected = this.state.selected.has(uri)

    return (
        <ImageView
            key={`${uri}___${index}`}
            item={item}
            selected={isSelected}
            selectedMarker={selectedMarker}
            columnWidth={this._columnWidth}
            onPress={this._selectImage.bind(this)}
        />
    )
  }

  _selectImage(image) {
    let {maximum, onSelect, onMaximumReached} = this.props
    const { selected } = this.state

    if (selected.has(image.uri)) {
      selected.delete(image.uri)
    } else {
      if (selected.size < maximum) {
        selected.add(image.uri)
      } else {
        onMaximumReached()
      }
    }

    onSelect(Array.from(selected), image)

    this.forceUpdate()
  }

  _renderFooter = () => {
    let {noMore} = this.state

    if (!noMore) {
      return (
        <View style={{height: 30, justifyContent: 'center', alignItems: 'center'}}>
          <ActivityIndicator
            animating={true}
            color={'#aaa'}
            size={'small'}/>
        </View>
      )
    }

    return null
  }
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      marginVertical: 20
    },
    wrapper:{
        flex: 1,
    },
    row:{
        flexDirection: 'row',
        flex: 1,
    },
    marker: {
        position: 'absolute',
        top: 5,
        backgroundColor: 'transparent',
    },
})
