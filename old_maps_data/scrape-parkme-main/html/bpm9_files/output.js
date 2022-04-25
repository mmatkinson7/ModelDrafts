// ==ClosureCompiler==
// @compilation_level ADVANCED_OPTIMIZATIONS
// @externs_url http://closure-compiler.googlecode.com/svn/trunk/contrib/externs/maps/google_maps_api_v3.js
// ==/ClosureCompiler==

/**
 * @name CSS3 InfoBubble with tabs for Google Maps API V3
 * @version 0.8
 * @author Luke Mahe
 * @fileoverview
 * This library is a CSS Infobubble with tabs. It uses css3 rounded corners and
 * drop shadows and animations. It also allows tabs
 */

/*
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */


/**
 * A CSS3 InfoBubble v0.8
 * @param {Object.<string, *>=} opt_options Optional properties to set.
 * @extends {google.maps.OverlayView}
 * @constructor
 */
function InfoBubble(opt_options) {
  this.extend(InfoBubble, google.maps.OverlayView);
  this.tabs_ = [];
  this.activeTab_ = null;
  this.baseZIndex_ = 100;
  this.isOpen_ = false;

  var options = opt_options || {};

  if (options['backgroundColor'] == undefined) {
    options['backgroundColor'] = this.BACKGROUND_COLOR_;
  }

  if (options['borderColor'] == undefined) {
    options['borderColor'] = this.BORDER_COLOR_;
  }

  if (options['borderRadius'] == undefined) {
    options['borderRadius'] = this.BORDER_RADIUS_;
  }

  if (options['borderWidth'] == undefined) {
    options['borderWidth'] = this.BORDER_WIDTH_;
  }

  if (options['padding'] == undefined) {
    options['padding'] = this.PADDING_;
  }

  if (options['arrowPosition'] == undefined) {
    options['arrowPosition'] = this.ARROW_POSITION_;
  }

  if (options['disableAutoPan'] == undefined) {
    options['disableAutoPan'] = false;
  }

  if (options['disableAnimation'] == undefined) {
    options['disableAnimation'] = false;
  }

  if (options['minWidth'] == undefined) {
    options['minWidth'] = this.MIN_WIDTH_;
  }

  if (options['shadowStyle'] == undefined) {
    options['shadowStyle'] = this.SHADOW_STYLE_;
  }

  if (options['arrowSize'] == undefined) {
    options['arrowSize'] = this.ARROW_SIZE_;
  }

  if (options['arrowStyle'] == undefined) {
    options['arrowStyle'] = this.ARROW_STYLE_;
  }

  if (options['mapMarginTop'] == undefined) {
    options['mapMarginTop'] = this.MAP_MARGIN_;
  }

  if (options['mapMarginRight'] == undefined) {
    options['mapMarginRight'] = this.MAP_MARGIN_;
  }

  if (options['mapMarginLeft'] == undefined) {
    options['mapMarginLeft'] = this.MAP_MARGIN_;
  }

  if (options['mapMarginBottom'] == undefined) {
    options['mapMarginBottom'] = this.MAP_MARGIN_;
  }

  if (options['xOffset'] == undefined) {
    options['xOffset'] = this.X_OFFSET_;
  }

  if (options['yOffset'] == undefined) {
    options['yOffset'] = this.Y_OFFSET_;
  }

  this.buildDom_();

  this.setValues(options);
}
window['InfoBubble'] = InfoBubble;


/**
 * Default arrow size
 * @const
 * @private
 */
InfoBubble.prototype.ARROW_SIZE_ = 15;

/**
 * Default close button size
 * @const
 * @private
 */
InfoBubble.prototype.CLOSE_BUTTON_SIZE_ = 13;

/**
 * Default arrow style
 * @const
 * @private
 */
InfoBubble.prototype.ARROW_STYLE_ = 0;


/**
 * Default shadow style
 * @const
 * @private
 */
InfoBubble.prototype.SHADOW_STYLE_ = 1;


/**
 * Default min width
 * @const
 * @private
 */
InfoBubble.prototype.MIN_WIDTH_ = 50;


/**
 * Default arrow position
 * @const
 * @private
 */
InfoBubble.prototype.ARROW_POSITION_ = 50;


/**
 * Default padding
 * @const
 * @private
 */
InfoBubble.prototype.PADDING_ = 10;

/**
 * Default margin
 * @const
 * @private
 */
InfoBubble.prototype.MAP_MARGIN_ = 5;


/**
 * Default border width
 * @const
 * @private
 */
InfoBubble.prototype.BORDER_WIDTH_ = 1;


/**
 * Default border color
 * @const
 * @private
 */
InfoBubble.prototype.BORDER_COLOR_ = '#ccc';


/**
 * Default border radius
 * @const
 * @private
 */
InfoBubble.prototype.BORDER_RADIUS_ = 10;


/**
 * Default background color
 * @const
 * @private
 */
InfoBubble.prototype.BACKGROUND_COLOR_ = '#fff';


/**
 * Default X-axis offset
 * @const
 * @private
 */
InfoBubble.prototype.X_OFFSET_ = 0;


/**
 * Default Y-axis offset
 * @const
 * @private
 */
InfoBubble.prototype.Y_OFFSET_ = 0;


/**
 * Extends a objects prototype by anothers.
 *
 * @param {Object} obj1 The object to be extended.
 * @param {Object} obj2 The object to extend with.
 * @return {Object} The new extended object.
 * @ignore
 */
InfoBubble.prototype.extend = function(obj1, obj2) {
  return (function(object) {
    for (var property in object.prototype) {
      this.prototype[property] = object.prototype[property];
    }
    return this;
  }).apply(obj1, [obj2]);
};


/**
 * Builds the InfoBubble dom
 * @private
 */
InfoBubble.prototype.buildDom_ = function() {
  var bubble = this.bubble_ = document.createElement('DIV');
  bubble.style['position'] = 'absolute';
  bubble.style['zIndex'] = this.baseZIndex_;

  var tabsContainer = this.tabsContainer_ = document.createElement('DIV');
  tabsContainer.style['position'] = 'relative';

  // Close button
  var close = this.close_ = document.createElement('IMG');
  close.style['position'] = 'absolute';
  close.style['width'] = this.px(this.CLOSE_BUTTON_SIZE_);
  close.style['height'] = this.px(this.CLOSE_BUTTON_SIZE_);
  close.style['border'] = 0;
  close.style['zIndex'] = this.baseZIndex_ + 1;
  close.style['cursor'] = 'pointer';
  close.src = '/lib/js/infobubble/iw_close.gif';

  var that = this;
  google.maps.event.addDomListener(close, 'click', function() {
    that.close();
    google.maps.event.trigger(that, 'closeclick');
  });

  // Content area
  var contentContainer = this.contentContainer_ = document.createElement('DIV');
  contentContainer.style['overflowX'] = 'hidden';
  contentContainer.style['overflowY'] = 'auto';
  contentContainer.style['cursor'] = 'default';
  contentContainer.style['clear'] = 'both';
  contentContainer.style['position'] = 'relative';

  var content = this.content_ = document.createElement('DIV');
  contentContainer.appendChild(content);

  // Arrow
  var arrow = this.arrow_ = document.createElement('DIV');
  arrow.style['position'] = 'relative';

  var arrowOuter = this.arrowOuter_ = document.createElement('DIV');
  var arrowInner = this.arrowInner_ = document.createElement('DIV');

  var arrowSize = this.getArrowSize_();

  arrowOuter.style['position'] = arrowInner.style['position'] = 'absolute';
  arrowOuter.style['left'] = arrowInner.style['left'] = '50%';
  arrowOuter.style['height'] = arrowInner.style['height'] = '0';
  arrowOuter.style['width'] = arrowInner.style['width'] = '0';
  arrowOuter.style['marginLeft'] = this.px(-arrowSize);
  arrowOuter.style['borderWidth'] = this.px(arrowSize);
  arrowOuter.style['borderBottomWidth'] = 0;

  // Shadow
  var bubbleShadow = this.bubbleShadow_ = document.createElement('DIV');
  bubbleShadow.style['position'] = 'absolute';

  // Hide the InfoBubble by default
  bubble.style['display'] = bubbleShadow.style['display'] = 'none';

  bubble.appendChild(this.tabsContainer_);
  bubble.appendChild(close);
  bubble.appendChild(contentContainer);
  arrow.appendChild(arrowOuter);
  arrow.appendChild(arrowInner);
  bubble.appendChild(arrow);

  var stylesheet = document.createElement('style');
  stylesheet.setAttribute('type', 'text/css');

  /**
   * The animation for the infobubble
   * @type {string}
   */
  this.animationName_ = '_ibani_' + Math.round(Math.random() * 10000);

  var css = '.' + this.animationName_ + '{-webkit-animation-name:' +
      this.animationName_ + ';-webkit-animation-duration:0.5s;' +
      '-webkit-animation-iteration-count:1;}' +
      '@-webkit-keyframes ' + this.animationName_ + ' {from {' +
      '-webkit-transform: scale(0)}70% {-webkit-transform: scale(1.1)}90% ' +
      '{-webkit-transform: scale(0.95)}to {-webkit-transform: scale(1)}}';

  stylesheet.textContent = css;
  document.getElementsByTagName('head')[0].appendChild(stylesheet);
};


/**
 * Sets the background class name
 *
 * @param {string} className The class name to set.
 */
InfoBubble.prototype.setBackgroundClassName = function(className) {
  this.set('backgroundClassName', className);
};
InfoBubble.prototype['setBackgroundClassName'] =
    InfoBubble.prototype.setBackgroundClassName;


/**
 * changed MVC callback
 */
InfoBubble.prototype.backgroundClassName_changed = function() {
  this.content_.className = this.get('backgroundClassName');
};
InfoBubble.prototype['backgroundClassName_changed'] =
    InfoBubble.prototype.backgroundClassName_changed;


/**
 * Sets the class of the tab
 *
 * @param {string} className the class name to set.
 */
InfoBubble.prototype.setTabClassName = function(className) {
  this.set('tabClassName', className);
};
InfoBubble.prototype['setTabClassName'] =
    InfoBubble.prototype.setTabClassName;


/**
 * tabClassName changed MVC callback
 */
InfoBubble.prototype.tabClassName_changed = function() {
  this.updateTabStyles_();
};
InfoBubble.prototype['tabClassName_changed'] =
    InfoBubble.prototype.tabClassName_changed;


/**
 * Gets the style of the arrow
 *
 * @private
 * @return {number} The style of the arrow.
 */
InfoBubble.prototype.getArrowStyle_ = function() {
  return parseInt(this.get('arrowStyle'), 10) || 0;
};


/**
 * Sets the style of the arrow
 *
 * @param {number} style The style of the arrow.
 */
InfoBubble.prototype.setArrowStyle = function(style) {
  this.set('arrowStyle', style);
};
InfoBubble.prototype['setArrowStyle'] =
    InfoBubble.prototype.setArrowStyle;


/**
 * Arrow style changed MVC callback
 */
InfoBubble.prototype.arrowStyle_changed = function() {
  this.arrowSize_changed();
};
InfoBubble.prototype['arrowStyle_changed'] =
    InfoBubble.prototype.arrowStyle_changed;


/**
 * Gets the size of the arrow
 *
 * @private
 * @return {number} The size of the arrow.
 */
InfoBubble.prototype.getArrowSize_ = function() {
  return parseInt(this.get('arrowSize'), 10) || 0;
};


/**
 * Sets the size of the arrow
 *
 * @param {number} size The size of the arrow.
 */
InfoBubble.prototype.setArrowSize = function(size) {
  this.set('arrowSize', size);
};
InfoBubble.prototype['setArrowSize'] =
    InfoBubble.prototype.setArrowSize;


/**
 * Arrow size changed MVC callback
 */
InfoBubble.prototype.arrowSize_changed = function() {
  this.borderWidth_changed();
};
InfoBubble.prototype['arrowSize_changed'] =
    InfoBubble.prototype.arrowSize_changed;


/**
 * Set the position of the InfoBubble arrow
 *
 * @param {number} pos The position to set.
 */
InfoBubble.prototype.setArrowPosition = function(pos) {
  this.set('arrowPosition', pos);
};
InfoBubble.prototype['setArrowPosition'] =
    InfoBubble.prototype.setArrowPosition;


/**
 * Get the position of the InfoBubble arrow
 *
 * @private
 * @return {number} The position..
 */
InfoBubble.prototype.getArrowPosition_ = function() {
  return parseInt(this.get('arrowPosition'), 10) || 0;
};


/**
 * arrowPosition changed MVC callback
 */
InfoBubble.prototype.arrowPosition_changed = function() {
  var pos = this.getArrowPosition_();
  this.arrowOuter_.style['left'] = this.arrowInner_.style['left'] = pos + '%';

  this.redraw_();
};
InfoBubble.prototype['arrowPosition_changed'] =
    InfoBubble.prototype.arrowPosition_changed;


/**
 * Set the zIndex of the InfoBubble
 *
 * @param {number} zIndex The zIndex to set.
 */
InfoBubble.prototype.setZIndex = function(zIndex) {
  this.set('zIndex', zIndex);
};
InfoBubble.prototype['setZIndex'] = InfoBubble.prototype.setZIndex;


/**
 * Get the zIndex of the InfoBubble
 *
 * @return {number} The zIndex to set.
 */
InfoBubble.prototype.getZIndex = function() {
  return parseInt(this.get('zIndex'), 10) || this.baseZIndex_;
};


/**
 * zIndex changed MVC callback
 */
InfoBubble.prototype.zIndex_changed = function() {
  var zIndex = this.getZIndex();

  this.bubble_.style['zIndex'] = this.baseZIndex_ = zIndex;
  this.close_.style['zIndex'] = zIndex + 1;
};
InfoBubble.prototype['zIndex_changed'] = InfoBubble.prototype.zIndex_changed;


/**
 * Set the style of the shadow
 *
 * @param {number} shadowStyle The style of the shadow.
 */
InfoBubble.prototype.setShadowStyle = function(shadowStyle) {
  this.set('shadowStyle', shadowStyle);
};
InfoBubble.prototype['setShadowStyle'] = InfoBubble.prototype.setShadowStyle;


/**
 * Get the style of the shadow
 *
 * @private
 * @return {number} The style of the shadow.
 */
InfoBubble.prototype.getShadowStyle_ = function() {
  return parseInt(this.get('shadowStyle'), 10) || 0;
};


/**
 * shadowStyle changed MVC callback
 */
InfoBubble.prototype.shadowStyle_changed = function() {
  var shadowStyle = this.getShadowStyle_();

  var display = '';
  var shadow = '';
  var backgroundColor = '';
  switch (shadowStyle) {
    case 0:
      display = 'none';
      break;
    case 1:
      shadow = '40px 15px 10px rgba(33,33,33,0.3)';
      backgroundColor = 'transparent';
      break;
    case 2:
      shadow = '0 0 2px rgba(33,33,33,0.3)';
      backgroundColor = 'rgba(33,33,33,0.35)';
      break;
    case 3:
      display = 'none';
      this.contentContainer_.style['box-shadow'] = '0px 3px 4px rgba(0,0,0,0.10)';
  }
  this.bubbleShadow_.style['boxShadow'] =
      this.bubbleShadow_.style['webkitBoxShadow'] =
      this.bubbleShadow_.style['MozBoxShadow'] = shadow;
  this.bubbleShadow_.style['backgroundColor'] = backgroundColor;
  if (this.isOpen_) {
    this.bubbleShadow_.style['display'] = display;
    this.draw();
  }
};
InfoBubble.prototype['shadowStyle_changed'] =
    InfoBubble.prototype.shadowStyle_changed;


/**
 * Show the close button
 */
InfoBubble.prototype.showCloseButton = function() {
  this.set('hideCloseButton', false);
};
InfoBubble.prototype['showCloseButton'] = InfoBubble.prototype.showCloseButton;


/**
 * Hide the close button
 */
InfoBubble.prototype.hideCloseButton = function() {
  this.set('hideCloseButton', true);
};
InfoBubble.prototype['hideCloseButton'] = InfoBubble.prototype.hideCloseButton;


/**
 * hideCloseButton changed MVC callback
 */
InfoBubble.prototype.hideCloseButton_changed = function() {
  this.close_.style['display'] = this.get('hideCloseButton') ? 'none' : '';
};
InfoBubble.prototype['hideCloseButton_changed'] =
    InfoBubble.prototype.hideCloseButton_changed;


/**
 * Set the background color
 *
 * @param {string} color The color to set.
 */
InfoBubble.prototype.setBackgroundColor = function(color) {
  if (color) {
    this.set('backgroundColor', color);
  }
};
InfoBubble.prototype['setBackgroundColor'] =
    InfoBubble.prototype.setBackgroundColor;


/**
 * backgroundColor changed MVC callback
 */
InfoBubble.prototype.backgroundColor_changed = function() {
  var backgroundColor = this.get('backgroundColor');
  this.contentContainer_.style['backgroundColor'] = backgroundColor;

  this.arrowInner_.style['borderColor'] = backgroundColor +
      ' transparent transparent';
  this.updateTabStyles_();
};
InfoBubble.prototype['backgroundColor_changed'] =
    InfoBubble.prototype.backgroundColor_changed;


/**
 * Set the border color
 *
 * @param {string} color The border color.
 */
InfoBubble.prototype.setBorderColor = function(color) {
  if (color) {
    this.set('borderColor', color);
  }
};
InfoBubble.prototype['setBorderColor'] = InfoBubble.prototype.setBorderColor;


/**
 * borderColor changed MVC callback
 */
InfoBubble.prototype.borderColor_changed = function() {
  var borderColor = this.get('borderColor');

  var contentContainer = this.contentContainer_;
  var arrowOuter = this.arrowOuter_;
  contentContainer.style['borderColor'] = borderColor;

  arrowOuter.style['borderColor'] = borderColor +
      ' transparent transparent';

  contentContainer.style['borderStyle'] =
      arrowOuter.style['borderStyle'] =
      this.arrowInner_.style['borderStyle'] = 'solid';

  this.updateTabStyles_();
};
InfoBubble.prototype['borderColor_changed'] =
    InfoBubble.prototype.borderColor_changed;


/**
 * Set the radius of the border
 *
 * @param {number} radius The radius of the border.
 */
InfoBubble.prototype.setBorderRadius = function(radius) {
  this.set('borderRadius', radius);
};
InfoBubble.prototype['setBorderRadius'] = InfoBubble.prototype.setBorderRadius;


/**
 * Get the radius of the border
 *
 * @private
 * @return {number} The radius of the border.
 */
InfoBubble.prototype.getBorderRadius_ = function() {
  return parseInt(this.get('borderRadius'), 10) || 0;
};


/**
 * borderRadius changed MVC callback
 */
InfoBubble.prototype.borderRadius_changed = function() {
  var borderRadius = this.getBorderRadius_();
  var borderWidth = this.getBorderWidth_();

  this.contentContainer_.style['borderRadius'] =
      this.contentContainer_.style['MozBorderRadius'] =
      this.contentContainer_.style['webkitBorderRadius'] =
      this.bubbleShadow_.style['borderRadius'] =
      this.bubbleShadow_.style['MozBorderRadius'] =
      this.bubbleShadow_.style['webkitBorderRadius'] = this.px(borderRadius);

  this.tabsContainer_.style['paddingLeft'] =
      this.tabsContainer_.style['paddingRight'] =
      this.px(borderRadius + borderWidth);

  this.redraw_();
};
InfoBubble.prototype['borderRadius_changed'] =
    InfoBubble.prototype.borderRadius_changed;


/**
 * Get the width of the border
 *
 * @private
 * @return {number} width The width of the border.
 */
InfoBubble.prototype.getBorderWidth_ = function() {
  return parseInt(this.get('borderWidth'), 10) || 0;
};


/**
 * Set the width of the border
 *
 * @param {number} width The width of the border.
 */
InfoBubble.prototype.setBorderWidth = function(width) {
  this.set('borderWidth', width);
};
InfoBubble.prototype['setBorderWidth'] = InfoBubble.prototype.setBorderWidth;


/**
 * borderWidth change MVC callback
 */
InfoBubble.prototype.borderWidth_changed = function() {
  var borderWidth = this.getBorderWidth_();

  this.contentContainer_.style['borderWidth'] = this.px(borderWidth);
  this.tabsContainer_.style['top'] = this.px(borderWidth);

  this.updateArrowStyle_();
  this.updateTabStyles_();
  this.borderRadius_changed();
  this.redraw_();
};
InfoBubble.prototype['borderWidth_changed'] =
    InfoBubble.prototype.borderWidth_changed;


/**
 * Update the arrow style
 * @private
 */
InfoBubble.prototype.updateArrowStyle_ = function() {
  var borderWidth = this.getBorderWidth_();
  var arrowSize = this.getArrowSize_();
  var arrowStyle = this.getArrowStyle_();
  var arrowOuterSizePx = this.px(arrowSize);
  var arrowInnerSizePx = this.px(Math.max(0, arrowSize - borderWidth));

  var outer = this.arrowOuter_;
  var inner = this.arrowInner_;

  this.arrow_.style['marginTop'] = this.px(-borderWidth);
  outer.style['borderTopWidth'] = arrowOuterSizePx;
  inner.style['borderTopWidth'] = arrowInnerSizePx;

  // Full arrow or arrow pointing to the left
  if (arrowStyle == 0 || arrowStyle == 1) {
    outer.style['borderLeftWidth'] = arrowOuterSizePx;
    inner.style['borderLeftWidth'] = arrowInnerSizePx;
  } else {
    outer.style['borderLeftWidth'] = inner.style['borderLeftWidth'] = 0;
  }

  // Full arrow or arrow pointing to the right
  if (arrowStyle == 0 || arrowStyle == 2) {
    outer.style['borderRightWidth'] = arrowOuterSizePx;
    inner.style['borderRightWidth'] = arrowInnerSizePx;
  } else {
    outer.style['borderRightWidth'] = inner.style['borderRightWidth'] = 0;
  }

  if (arrowStyle < 2) {
    outer.style['marginLeft'] = this.px(-(arrowSize));
    inner.style['marginLeft'] = this.px(-(arrowSize - borderWidth));
  } else {
    outer.style['marginLeft'] = inner.style['marginLeft'] = 0;
  }

  // If there is no border then don't show thw outer arrow
  if (borderWidth == 0) {
    outer.style['display'] = 'none';
  } else {
    outer.style['display'] = '';
  }
};


/**
 * Set the padding of the InfoBubble
 *
 * @param {number} padding The padding to apply.
 */
InfoBubble.prototype.setPadding = function(padding) {
  this.set('padding', padding);
};
InfoBubble.prototype['setPadding'] = InfoBubble.prototype.setPadding;


/**
 * Set the padding of the InfoBubble
 *
 * @private
 * @return {number} padding The padding to apply.
 */
InfoBubble.prototype.getPadding_ = function() {
  return parseInt(this.get('padding'), 10) || 0;
};


/**
 * padding changed MVC callback
 */
InfoBubble.prototype.padding_changed = function() {
  var padding = this.getPadding_();
  this.contentContainer_.style['padding'] = this.px(padding);
  this.updateTabStyles_();

  this.redraw_();
};
InfoBubble.prototype['padding_changed'] = InfoBubble.prototype.padding_changed;


/**
 * Add px extention to the number
 *
 * @param {number} num The number to wrap.
 * @return {string|number} A wrapped number.
 */
InfoBubble.prototype.px = function(num) {
  if (num) {
    // 0 doesn't need to be wrapped
    return num + 'px';
  }
  return num;
};


/**
 * Add events to stop propagation
 * @private
 */
InfoBubble.prototype.addEvents_ = function() {
  // We want to cancel all the events so they do not go to the map
  var events = ['mousedown', 'mousemove', 'mouseover', 'mouseout', 'mouseup',
      'mousewheel', 'DOMMouseScroll', 'touchstart', 'touchend', 'touchmove',
      'dblclick', 'contextmenu', 'click'];

  var bubble = this.bubble_;
  this.listeners_ = [];
  for (var i = 0, event; event = events[i]; i++) {
    this.listeners_.push(
      google.maps.event.addDomListener(bubble, event, function(e) {
        e.cancelBubble = true;
        if (e.stopPropagation) {
          e.stopPropagation();
        }
      })
    );
  }
};


/**
 * On Adding the InfoBubble to a map
 * Implementing the OverlayView interface
 */
InfoBubble.prototype.onAdd = function() {
  if (!this.bubble_) {
    this.buildDom_();
  }

  this.addEvents_();

  var panes = this.getPanes();
  if (panes) {
    panes.floatPane.appendChild(this.bubble_);
    panes.floatShadow.appendChild(this.bubbleShadow_);
  }
};
InfoBubble.prototype['onAdd'] = InfoBubble.prototype.onAdd;


/**
 * Draw the InfoBubble
 * Implementing the OverlayView interface
 */
InfoBubble.prototype.draw = function() {
  var projection = this.getProjection();

  if (!projection) {
    // The map projection is not ready yet so do nothing
    return;
  }

  var latLng = /** @type {google.maps.LatLng} */ (this.get('position'));

  if (!latLng) {
    this.close();
    return;
  }

  var tabHeight = 0;

  if (this.activeTab_) {
    tabHeight = this.activeTab_.offsetHeight;
  }

  var anchorHeight = this.getAnchorHeight_();
  var arrowSize = this.getArrowSize_();
  var arrowPosition = this.getArrowPosition_();

  arrowPosition = arrowPosition / 100;

  var pos = projection.fromLatLngToDivPixel(latLng);
  var width = this.contentContainer_.offsetWidth;
  var height = this.bubble_.offsetHeight;

  if (!width) {
    return;
  }

  // Adjust for the height of the info bubble
  var top = pos.y - (height + arrowSize) + this.get('yOffset');

  if (anchorHeight) {
    // If there is an anchor then include the height
    top -= anchorHeight;
  }

  var left = pos.x - (width * arrowPosition) + this.get('xOffset');

  this.bubble_.style['top'] = this.px(top);
  this.bubble_.style['left'] = this.px(left);

  var shadowStyle = parseInt(this.get('shadowStyle'), 10);

  switch (shadowStyle) {
    case 1:
      // Shadow is behind
      this.bubbleShadow_.style['top'] = this.px(top + tabHeight - 1);
      this.bubbleShadow_.style['left'] = this.px(left);
      this.bubbleShadow_.style['width'] = this.px(width);
      this.bubbleShadow_.style['height'] =
          this.px(this.contentContainer_.offsetHeight - arrowSize);
      break;
    case 2:
      // Shadow is below
      width = width * 0.8;
      if (anchorHeight) {
        this.bubbleShadow_.style['top'] = this.px(pos.y);
      } else {
        this.bubbleShadow_.style['top'] = this.px(pos.y + arrowSize);
      }
      this.bubbleShadow_.style['left'] = this.px(pos.x - width * arrowPosition);

      this.bubbleShadow_.style['width'] = this.px(width);
      this.bubbleShadow_.style['height'] = this.px(2);
      break;
  }
};
InfoBubble.prototype['draw'] = InfoBubble.prototype.draw;


/**
 * Removing the InfoBubble from a map
 */
InfoBubble.prototype.onRemove = function() {
  if (this.bubble_ && this.bubble_.parentNode) {
    this.bubble_.parentNode.removeChild(this.bubble_);
  }
  if (this.bubbleShadow_ && this.bubbleShadow_.parentNode) {
    this.bubbleShadow_.parentNode.removeChild(this.bubbleShadow_);
  }

  for (var i = 0, listener; listener = this.listeners_[i]; i++) {
    google.maps.event.removeListener(listener);
  }
};
InfoBubble.prototype['onRemove'] = InfoBubble.prototype.onRemove;


/**
 * Is the InfoBubble open
 *
 * @return {boolean} If the InfoBubble is open.
 */
InfoBubble.prototype.isOpen = function() {
  return this.isOpen_;
};
InfoBubble.prototype['isOpen'] = InfoBubble.prototype.isOpen;


/**
 * Close the InfoBubble
 */
InfoBubble.prototype.close = function() {
  if (this.bubble_) {
    this.bubble_.style['display'] = 'none';
    // Remove the animation so we next time it opens it will animate again
    this.bubble_.className =
        this.bubble_.className.replace(this.animationName_, '');
  }

  if (this.bubbleShadow_) {
    this.bubbleShadow_.style['display'] = 'none';
    this.bubbleShadow_.className =
        this.bubbleShadow_.className.replace(this.animationName_, '');
  }
  this.isOpen_ = false;
};
InfoBubble.prototype['close'] = InfoBubble.prototype.close;


/**
 * Open the InfoBubble (asynchronous).
 *
 * @param {google.maps.Map=} opt_map Optional map to open on.
 * @param {google.maps.MVCObject=} opt_anchor Optional anchor to position at.
 */
InfoBubble.prototype.open = function(opt_map, opt_anchor) {
  var that = this;
  window.setTimeout(function() {
    that.open_(opt_map, opt_anchor);
  }, 0);
};

/**
 * Open the InfoBubble
 * @private
 * @param {google.maps.Map=} opt_map Optional map to open on.
 * @param {google.maps.MVCObject=} opt_anchor Optional anchor to position at.
 */
InfoBubble.prototype.open_ = function(opt_map, opt_anchor) {
  this.updateContent_();

  if (opt_map) {
    this.setMap(opt_map);
  }

  if (opt_anchor) {
    this.set('anchor', opt_anchor);
    this.bindTo('anchorPoint', opt_anchor);
    this.bindTo('position', opt_anchor);
  }

  // Show the bubble and the show
  this.bubble_.style['display'] = this.bubbleShadow_.style['display'] = '';
  var animation = !this.get('disableAnimation');

  if (animation) {
    // Add the animation
    this.bubble_.className += ' ' + this.animationName_;
    this.bubbleShadow_.className += ' ' + this.animationName_;
  }

  this.redraw_();
  this.isOpen_ = true;

  var pan = !this.get('disableAutoPan');
  if (pan) {
    var that = this;
    window.setTimeout(function() {
      // Pan into view, done in a time out to make it feel nicer :)
      that.panToView();
    }, 200);
  }
};
InfoBubble.prototype['open'] = InfoBubble.prototype.open;


/**
 * Set the position of the InfoBubble
 *
 * @param {google.maps.LatLng} position The position to set.
 */
InfoBubble.prototype.setPosition = function(position) {
  if (position) {
    this.set('position', position);
  }
};
InfoBubble.prototype['setPosition'] = InfoBubble.prototype.setPosition;


/**
 * Returns the position of the InfoBubble
 *
 * @return {google.maps.LatLng} the position.
 */
InfoBubble.prototype.getPosition = function() {
  return /** @type {google.maps.LatLng} */ (this.get('position'));
};
InfoBubble.prototype['getPosition'] = InfoBubble.prototype.getPosition;


/**
 * position changed MVC callback
 */
InfoBubble.prototype.position_changed = function() {
  this.draw();
};
InfoBubble.prototype['position_changed'] =
    InfoBubble.prototype.position_changed;


/**
 * Pan the InfoBubble into view
 */
InfoBubble.prototype.panToView = function() {
  var projection = this.getProjection();

  if (!projection) {
    // The map projection is not ready yet so do nothing
    return;
  }

  if (!this.bubble_) {
    // No Bubble yet so do nothing
    return;
  }

  // element height and width
  var height = this.bubble_.offsetHeight + this.getAnchorHeight_();
  var width = this.bubble_.offsetWidth;
  var latLng = this.getPosition();
  var pos = projection.fromLatLngToContainerPixel(latLng);

  // map vars
  var map = this.get('map');
  var mapDiv = map.getDiv();
  var mapHeight = mapDiv.offsetHeight;
  var mapWidth = mapDiv.offsetWidth;
  var centerPos = projection.fromLatLngToContainerPixel(map.getCenter());
  var map_margin = this.MAP_MARGIN_;
  var map_margin_left = this.get('mapMarginLeft');
  var map_margin_right = this.get('mapMarginRight');
  var map_margin_top = this.get('mapMarginTop');
  var map_margin_bottom = this.get('mapMarginBottom');

  // Find out how much space is available on all sides
  var spaceTop = pos.y - height - map_margin_top;
  var spaceBottom = mapHeight - centerPos.y;
  var spaceLeft = pos.x - map_margin_left - (width / 2);
  var spaceRight = mapWidth - map_margin_right - pos.x - (width / 2);

  if (spaceTop > 0 && spaceLeft > 0 && spaceRight > 0) {
    return;
  }

  if (spaceTop <= 0) {
    pos.y = centerPos.y + spaceTop - map_margin;
  } else {
    pos.y = centerPos.y;
  }

  if (spaceLeft <= 0) {
    pos.x = centerPos.x + spaceLeft - map_margin;
  } else if (spaceRight <= 0) {
    pos.x = centerPos.x - spaceRight + map_margin;
  } else {
    pos.x = centerPos.x;
  }

  latLng = projection.fromContainerPixelToLatLng(pos);

  if (map.getCenter() != latLng) {
    map.panTo(latLng);
  }
};
InfoBubble.prototype['panToView'] = InfoBubble.prototype.panToView;


/**
 * Converts a HTML string to a document fragment.
 *
 * @param {string} htmlString The HTML string to convert.
 * @return {Node} A HTML document fragment.
 * @private
 */
InfoBubble.prototype.htmlToDocumentFragment_ = function(htmlString) {
  htmlString = htmlString.replace(/^\s*([\S\s]*)\b\s*$/, '$1');
  var tempDiv = document.createElement('DIV');
  tempDiv.innerHTML = htmlString;
  if (tempDiv.childNodes.length == 1) {
    return /** @type {!Node} */ (tempDiv.removeChild(tempDiv.firstChild));
  } else {
    var fragment = document.createDocumentFragment();
    while (tempDiv.firstChild) {
      fragment.appendChild(tempDiv.firstChild);
    }
    return fragment;
  }
};


/**
 * Removes all children from the node.
 *
 * @param {Node} node The node to remove all children from.
 * @private
 */
InfoBubble.prototype.removeChildren_ = function(node) {
  if (!node) {
    return;
  }

  var child;
  while (child = node.firstChild) {
    node.removeChild(child);
  }
};


/**
 * Sets the content of the infobubble.
 *
 * @param {string|Node} content The content to set.
 */
InfoBubble.prototype.setContent = function(content) {
  this.set('content', content);
};
InfoBubble.prototype['setContent'] = InfoBubble.prototype.setContent;


/**
 * Get the content of the infobubble.
 *
 * @return {string|Node} The marker content.
 */
InfoBubble.prototype.getContent = function() {
  return /** @type {Node|string} */ (this.get('content'));
};
InfoBubble.prototype['getContent'] = InfoBubble.prototype.getContent;


/**
 * Sets the marker content and adds loading events to images
 */
InfoBubble.prototype.updateContent_ = function() {
  if (!this.content_) {
    // The Content area doesnt exist.
    return;
  }

  this.removeChildren_(this.content_);
  var content = this.getContent();
  if (content) {
    if (typeof content == 'string') {
      content = this.htmlToDocumentFragment_(content);
    }
    this.content_.appendChild(content);

    var that = this;
    var images = this.content_.getElementsByTagName('IMG');
    for (var i = 0, image; image = images[i]; i++) {
      // Because we don't know the size of an image till it loads, add a
      // listener to the image load so the marker can resize and reposition
      // itself to be the correct height.
      google.maps.event.addDomListener(image, 'load', function() {
        that.imageLoaded_();
      });
    }
    google.maps.event.trigger(this, 'domready');
  }
  this.redraw_();
};

/**
 * Image loaded
 * @private
 */
InfoBubble.prototype.imageLoaded_ = function() {
  var pan = !this.get('disableAutoPan');
  this.redraw_();
  if (pan && (this.tabs_.length == 0 || this.activeTab_.index == 0)) {
    this.panToView();
  }
};

/**
 * Updates the styles of the tabs
 * @private
 */
InfoBubble.prototype.updateTabStyles_ = function() {
  if (this.tabs_ && this.tabs_.length) {
    for (var i = 0, tab; tab = this.tabs_[i]; i++) {
      this.setTabStyle_(tab.tab);
    }
    this.activeTab_.style['zIndex'] = this.baseZIndex_;
    var borderWidth = this.getBorderWidth_();
    var padding = this.getPadding_() / 2;
    this.activeTab_.style['borderBottomWidth'] = 0;
    this.activeTab_.style['paddingBottom'] = this.px(padding + borderWidth);
  }
};


/**
 * Sets the style of a tab
 * @private
 * @param {Element} tab The tab to style.
 */
InfoBubble.prototype.setTabStyle_ = function(tab) {
  var backgroundColor = this.get('backgroundColor');
  var borderColor = this.get('borderColor');
  var borderRadius = this.getBorderRadius_();
  var borderWidth = this.getBorderWidth_();
  var padding = this.getPadding_();

  var marginRight = this.px(-(Math.max(padding, borderRadius)));
  var borderRadiusPx = this.px(borderRadius);

  var index = this.baseZIndex_;
  if (tab.index) {
    index -= tab.index;
  }

  // The styles for the tab
  var styles = {
    'cssFloat': 'left',
    'position': 'relative',
    'cursor': 'pointer',
    'backgroundColor': backgroundColor,
    'border': this.px(borderWidth) + ' solid ' + borderColor,
    'padding': this.px(padding / 2) + ' ' + this.px(padding),
    'marginRight': marginRight,
    'whiteSpace': 'nowrap',
    'borderRadiusTopLeft': borderRadiusPx,
    'MozBorderRadiusTopleft': borderRadiusPx,
    'webkitBorderTopLeftRadius': borderRadiusPx,
    'borderRadiusTopRight': borderRadiusPx,
    'MozBorderRadiusTopright': borderRadiusPx,
    'webkitBorderTopRightRadius': borderRadiusPx,
    'zIndex': index,
    'display': 'inline'
  };

  for (var style in styles) {
    tab.style[style] = styles[style];
  }

  var className = this.get('tabClassName');
  if (className != undefined) {
    tab.className += ' ' + className;
  }
};


/**
 * Add user actions to a tab
 * @private
 * @param {Object} tab The tab to add the actions to.
 */
InfoBubble.prototype.addTabActions_ = function(tab) {
  var that = this;
  tab.listener_ = google.maps.event.addDomListener(tab, 'click', function() {
    that.setTabActive_(this);
  });
};


/**
 * Set a tab at a index to be active
 *
 * @param {number} index The index of the tab.
 */
InfoBubble.prototype.setTabActive = function(index) {
  var tab = this.tabs_[index - 1];

  if (tab) {
    this.setTabActive_(tab.tab);
  }
};
InfoBubble.prototype['setTabActive'] = InfoBubble.prototype.setTabActive;


/**
 * Set a tab to be active
 * @private
 * @param {Object} tab The tab to set active.
 */
InfoBubble.prototype.setTabActive_ = function(tab) {
  if (!tab) {
    this.setContent('');
    this.updateContent_();
    return;
  }

  var padding = this.getPadding_() / 2;
  var borderWidth = this.getBorderWidth_();

  if (this.activeTab_) {
    var activeTab = this.activeTab_;
    activeTab.style['zIndex'] = this.baseZIndex_ - activeTab.index;
    activeTab.style['paddingBottom'] = this.px(padding);
    activeTab.style['borderBottomWidth'] = this.px(borderWidth);
  }

  tab.style['zIndex'] = this.baseZIndex_;
  tab.style['borderBottomWidth'] = 0;
  tab.style['marginBottomWidth'] = '-10px';
  tab.style['paddingBottom'] = this.px(padding + borderWidth);

  this.setContent(this.tabs_[tab.index].content);
  this.updateContent_();

  this.activeTab_ = tab;

  this.redraw_();
};


/**
 * Set the max width of the InfoBubble
 *
 * @param {number} width The max width.
 */
InfoBubble.prototype.setMaxWidth = function(width) {
  this.set('maxWidth', width);
};
InfoBubble.prototype['setMaxWidth'] = InfoBubble.prototype.setMaxWidth;


/**
 * maxWidth changed MVC callback
 */
InfoBubble.prototype.maxWidth_changed = function() {
  this.redraw_();
};
InfoBubble.prototype['maxWidth_changed'] =
    InfoBubble.prototype.maxWidth_changed;


/**
 * Set the max height of the InfoBubble
 *
 * @param {number} height The max height.
 */
InfoBubble.prototype.setMaxHeight = function(height) {
  this.set('maxHeight', height);
};
InfoBubble.prototype['setMaxHeight'] = InfoBubble.prototype.setMaxHeight;


/**
 * maxHeight changed MVC callback
 */
InfoBubble.prototype.maxHeight_changed = function() {
  this.redraw_();
};
InfoBubble.prototype['maxHeight_changed'] =
    InfoBubble.prototype.maxHeight_changed;


/**
 * Set the min width of the InfoBubble
 *
 * @param {number} width The min width.
 */
InfoBubble.prototype.setMinWidth = function(width) {
  this.set('minWidth', width);
};
InfoBubble.prototype['setMinWidth'] = InfoBubble.prototype.setMinWidth;


/**
 * minWidth changed MVC callback
 */
InfoBubble.prototype.minWidth_changed = function() {
  this.redraw_();
};
InfoBubble.prototype['minWidth_changed'] =
    InfoBubble.prototype.minWidth_changed;


/**
 * Set the min height of the InfoBubble
 *
 * @param {number} height The min height.
 */
InfoBubble.prototype.setMinHeight = function(height) {
  this.set('minHeight', height);
};
InfoBubble.prototype['setMinHeight'] = InfoBubble.prototype.setMinHeight;


/**
 * minHeight changed MVC callback
 */
InfoBubble.prototype.minHeight_changed = function() {
  this.redraw_();
};
InfoBubble.prototype['minHeight_changed'] =
    InfoBubble.prototype.minHeight_changed;


/**
 * Add a tab
 *
 * @param {string} label The label of the tab.
 * @param {string|Element} content The content of the tab.
 */
InfoBubble.prototype.addTab = function(label, content) {
  var tab = document.createElement('DIV');
  tab.innerHTML = label;

  this.setTabStyle_(tab);
  this.addTabActions_(tab);

  this.tabsContainer_.appendChild(tab);

  this.tabs_.push({
    label: label,
    content: content,
    tab: tab
  });

  tab.index = this.tabs_.length - 1;
  tab.style['zIndex'] = this.baseZIndex_ - tab.index;

  if (!this.activeTab_) {
    this.setTabActive_(tab);
  }

  tab.className = tab.className + ' ' + this.animationName_;

  this.redraw_();
};
InfoBubble.prototype['addTab'] = InfoBubble.prototype.addTab;

/**
 * Update a tab at a speicifc index
 *
 * @param {number} index The index of the tab.
 * @param {?string} opt_label The label to change to.
 * @param {?string} opt_content The content to update to.
 */
InfoBubble.prototype.updateTab = function(index, opt_label, opt_content) {
  if (!this.tabs_.length || index < 0 || index >= this.tabs_.length) {
    return;
  }

  var tab = this.tabs_[index];
  if (opt_label != undefined) {
    tab.tab.innerHTML = tab.label = opt_label;
  }

  if (opt_content != undefined) {
    tab.content = opt_content;
  }

  if (this.activeTab_ == tab.tab) {
    this.setContent(tab.content);
    this.updateContent_();
  }
  this.redraw_();
};
InfoBubble.prototype['updateTab'] = InfoBubble.prototype.updateTab;


/**
 * Remove a tab at a specific index
 *
 * @param {number} index The index of the tab to remove.
 */
InfoBubble.prototype.removeTab = function(index) {
  if (!this.tabs_.length || index < 0 || index >= this.tabs_.length) {
    return;
  }

  var tab = this.tabs_[index];
  tab.tab.parentNode.removeChild(tab.tab);

  google.maps.event.removeListener(tab.tab.listener_);

  this.tabs_.splice(index, 1);

  delete tab;

  for (var i = 0, t; t = this.tabs_[i]; i++) {
    t.tab.index = i;
  }

  if (tab.tab == this.activeTab_) {
    // Removing the current active tab
    if (this.tabs_[index]) {
      // Show the tab to the right
      this.activeTab_ = this.tabs_[index].tab;
    } else if (this.tabs_[index - 1]) {
      // Show a tab to the left
      this.activeTab_ = this.tabs_[index - 1].tab;
    } else {
      // No tabs left to sho
      this.activeTab_ = undefined;
    }

    this.setTabActive_(this.activeTab_);
  }

  this.redraw_();
};
InfoBubble.prototype['removeTab'] = InfoBubble.prototype.removeTab;


/**
 * Get the size of an element
 * @private
 * @param {Node|string} element The element to size.
 * @param {number=} opt_maxWidth Optional max width of the element.
 * @param {number=} opt_maxHeight Optional max height of the element.
 * @return {google.maps.Size} The size of the element.
 */
InfoBubble.prototype.getElementSize_ = function(element, opt_maxWidth,
                                                opt_maxHeight) {
  var sizer = document.createElement('DIV');
  sizer.style['display'] = 'inline';
  sizer.style['position'] = 'absolute';
  sizer.style['visibility'] = 'hidden';

  if (typeof element == 'string') {
    sizer.innerHTML = element;
  } else {
    sizer.appendChild(element.cloneNode(true));
  }


  // Note: Intentionally changed this from an append to a prepend.
  //  When the Div was bigger than the screen size
  //  (aka big bubble or small widget/mobile) appending the div to the
  //  bottom would cause it to squish.  In turn, this would case
  //  the infobubbles to be unreasonably tall.
  //  Old code:  document.body.appendChild(sizer);
  document.body.insertBefore(sizer, document.body.firstChild);

  var size = new google.maps.Size(sizer.offsetWidth, sizer.offsetHeight);

  // If the width is bigger than the max width then set the width and size again
  if (opt_maxWidth && size.width > opt_maxWidth) {
    sizer.style['width'] = this.px(opt_maxWidth);
    size = new google.maps.Size(sizer.offsetWidth, sizer.offsetHeight);
  }

  // If the height is bigger than the max height then set the height and size
  // again
  if (opt_maxHeight && size.height > opt_maxHeight) {
    sizer.style['height'] = this.px(opt_maxHeight);
    size = new google.maps.Size(sizer.offsetWidth, sizer.offsetHeight);
  }

  document.body.removeChild(sizer);
  delete sizer;
  return size;
};


/**
 * Redraw the InfoBubble
 * @private
 */
InfoBubble.prototype.redraw_ = function() {
  this.figureOutSize_();
  this.positionCloseButton_();
  this.draw();
};


/**
 * Figure out the optimum size of the InfoBubble
 * @private
 */
InfoBubble.prototype.figureOutSize_ = function() {
  var map = this.get('map');

  if (!map) {
    return;
  }

  var padding = this.getPadding_();
  var borderWidth = this.getBorderWidth_();
  var borderRadius = this.getBorderRadius_();
  var arrowSize = this.getArrowSize_();

  var mapDiv = map.getDiv();
  var gutter = arrowSize * 2;
  var mapWidth = mapDiv.offsetWidth - gutter;
  var mapHeight = mapDiv.offsetHeight - gutter - this.getAnchorHeight_();
  var tabHeight = 0;
  var width = /** @type {number} */ (this.get('minWidth') || 0);
  var height = /** @type {number} */ (this.get('minHeight') || 0);
  var maxWidth = /** @type {number} */ (this.get('maxWidth') || 0);
  var maxHeight = /** @type {number} */ (this.get('maxHeight') || 0);

  maxWidth = Math.min(mapWidth, maxWidth);
  maxHeight = Math.min(mapHeight, maxHeight);

  var tabWidth = 0;
  if (this.tabs_.length) {
    // If there are tabs then you need to check the size of each tab's content
    for (var i = 0, tab; tab = this.tabs_[i]; i++) {
      var tabSize = this.getElementSize_(tab.tab, maxWidth, maxHeight);
      var contentSize = this.getElementSize_(tab.content, maxWidth, maxHeight);

      if (width < tabSize.width) {
        width = tabSize.width;
      }

      // Add up all the tab widths because they might end up being wider than
      // the content
      tabWidth += tabSize.width;

      if (height < tabSize.height) {
        height = tabSize.height;
      }

      if (tabSize.height > tabHeight) {
        tabHeight = tabSize.height;
      }

      if (width < contentSize.width) {
        width = contentSize.width;
      }

      if (height < contentSize.height) {
        height = contentSize.height;
      }
    }
  } else {
    var content = /** @type {string|Node} */ (this.get('content'));
    if (typeof content == 'string') {
      content = this.htmlToDocumentFragment_(content);
    }
    if (content) {
      var contentSize = this.getElementSize_(content, maxWidth, maxHeight);

      if (width < contentSize.width) {
        width = contentSize.width;
      }

      if (height < contentSize.height) {
        height = contentSize.height;
      }
    }
  }

  if (maxWidth) {
    width = Math.min(width, maxWidth);
  }

  if (maxHeight) {
    height = Math.min(height, maxHeight);
  }

  width = Math.max(width, tabWidth);

  if (width == tabWidth) {
    width = width + 2 * padding;
  }

  arrowSize = arrowSize * 2;
  width = Math.max(width, arrowSize);

  // Maybe add this as a option so they can go bigger than the map if the user
  // wants
  if (width > mapWidth) {
    width = mapWidth;
  }

  if (height > mapHeight) {
    height = mapHeight - tabHeight;
  }

  if (this.tabsContainer_) {
    this.tabHeight_ = tabHeight;
    this.tabsContainer_.style['width'] = this.px(tabWidth);
  }

  this.contentContainer_.style['width'] = this.px(width);
  this.contentContainer_.style['height'] = this.px(height);
};


/**
 *  Get the height of the anchor
 *
 *  This function is a hack for now and doesn't really work that good, need to
 *  wait for pixelBounds to be correctly exposed.
 *  @private
 *  @return {number} The height of the anchor.
 */
InfoBubble.prototype.getAnchorHeight_ = function() {
  var anchor = this.get('anchor');
  if (anchor) {
    var anchorPoint = /** @type google.maps.Point */(this.get('anchorPoint'));

    if (anchorPoint) {
      return -1 * anchorPoint.y;
    }
  }
  return 0;
};

InfoBubble.prototype.anchorPoint_changed = function() {
  this.draw();
};
InfoBubble.prototype['anchorPoint_changed'] = InfoBubble.prototype.anchorPoint_changed;


/**
 * Position the close button in the right spot.
 * @private
 */
InfoBubble.prototype.positionCloseButton_ = function() {
  var br = this.getBorderRadius_();
  var bw = this.getBorderWidth_();

  var right = 2;
  var top = 2;

  if (this.tabs_.length && this.tabHeight_) {
    top += this.tabHeight_;
  }

  top += bw;
  right += bw;

  var c = this.contentContainer_;
  if (c && c.clientHeight < c.scrollHeight) {
    // If there are scrollbars then move the cross in so it is not over
    // scrollbar
    right += 15;
  }

  this.close_.style['right'] = this.px(right);
  this.close_.style['top'] = this.px(top);
};
;
/**
 * @name MarkerWithLabel for V3
 * @version 1.1.10 [April 8, 2014]
 * @author Gary Little (inspired by code from Marc Ridey of Google).
 * @copyright Copyright 2012 Gary Little [gary at luxcentral.com]
 * @fileoverview MarkerWithLabel extends the Google Maps JavaScript API V3
 *  <code>google.maps.Marker</code> class.
 *  <p>
 *  MarkerWithLabel allows you to define markers with associated labels. As you would expect,
 *  if the marker is draggable, so too will be the label. In addition, a marker with a label
 *  responds to all mouse events in the same manner as a regular marker. It also fires mouse
 *  events and "property changed" events just as a regular marker would. Version 1.1 adds
 *  support for the raiseOnDrag feature introduced in API V3.3.
 *  <p>
 *  If you drag a marker by its label, you can cancel the drag and return the marker to its
 *  original position by pressing the <code>Esc</code> key. This doesn't work if you drag the marker
 *  itself because this feature is not (yet) supported in the <code>google.maps.Marker</code> class.
 */

/*!
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *       http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/*jslint browser:true */
/*global document,google */

/**
 * @param {Function} childCtor Child class.
 * @param {Function} parentCtor Parent class.
 * @private
 */
function inherits(childCtor, parentCtor) {
  /* @constructor */
  function tempCtor() {}
  tempCtor.prototype = parentCtor.prototype;
  childCtor.superClass_ = parentCtor.prototype;
  childCtor.prototype = new tempCtor();
  /* @override */
  childCtor.prototype.constructor = childCtor;
}

/**
 * This constructor creates a label and associates it with a marker.
 * It is for the private use of the MarkerWithLabel class.
 * @constructor
 * @param {Marker} marker The marker with which the label is to be associated.
 * @param {string} crossURL The URL of the cross image =.
 * @param {string} handCursor The URL of the hand cursor.
 * @private
 */
function MarkerLabel_(marker, crossURL, handCursorURL) {
  this.marker_ = marker;
  this.handCursorURL_ = marker.handCursorURL;

  this.labelDiv_ = document.createElement("div");
  this.labelDiv_.style.cssText = "position: absolute; overflow: hidden;";

  // Set up the DIV for handling mouse events in the label. This DIV forms a transparent veil
  // in the "overlayMouseTarget" pane, a veil that covers just the label. This is done so that
  // events can be captured even if the label is in the shadow of a google.maps.InfoWindow.
  // Code is included here to ensure the veil is always exactly the same size as the label.
  this.eventDiv_ = document.createElement("div");
  this.eventDiv_.style.cssText = this.labelDiv_.style.cssText;

  // This is needed for proper behavior on MSIE:
  this.eventDiv_.setAttribute("onselectstart", "return false;");
  this.eventDiv_.setAttribute("ondragstart", "return false;");

  // Get the DIV for the "X" to be displayed when the marker is raised.
  this.crossDiv_ = MarkerLabel_.getSharedCross(crossURL);
}

inherits(MarkerLabel_, google.maps.OverlayView);

/**
 * Returns the DIV for the cross used when dragging a marker when the
 * raiseOnDrag parameter set to true. One cross is shared with all markers.
 * @param {string} crossURL The URL of the cross image =.
 * @private
 */
MarkerLabel_.getSharedCross = function (crossURL) {
  var div;
  if (typeof MarkerLabel_.getSharedCross.crossDiv === "undefined") {
    div = document.createElement("img");
    div.style.cssText = "position: absolute; z-index: 1000002; display: none;";
    // Hopefully Google never changes the standard "X" attributes:
    div.style.marginLeft = "-8px";
    div.style.marginTop = "-9px";
    div.src = crossURL;
    MarkerLabel_.getSharedCross.crossDiv = div;
  }
  return MarkerLabel_.getSharedCross.crossDiv;
};

/**
 * Adds the DIV representing the label to the DOM. This method is called
 * automatically when the marker's <code>setMap</code> method is called.
 * @private
 */
MarkerLabel_.prototype.onAdd = function () {
  var me = this;
  var cMouseIsDown = false;
  var cDraggingLabel = false;
  var cSavedZIndex;
  var cLatOffset, cLngOffset;
  var cIgnoreClick;
  var cRaiseEnabled;
  var cStartPosition;
  var cStartCenter;
  // Constants:
  var cRaiseOffset = 20;
  var cDraggingCursor = "url(" + this.handCursorURL_ + ")";

  // Stops all processing of an event.
  //
  var cAbortEvent = function (e) {
    if (e.preventDefault) {
      e.preventDefault();
    }
    e.cancelBubble = true;
    if (e.stopPropagation) {
      e.stopPropagation();
    }
  };

  var cStopBounce = function () {
    me.marker_.setAnimation(null);
  };

  // EDITED
  /* //code.google.com/p/google-maps-utility-library-v3/issues/detail?can=2&start=0&num=100&q=&colspec=ID%20Type%20Status%20Priority%20Fixed%20Owner%20Summary%20Stars&groupby=&sort=&id=24 */
  this.getPanes().markerLayer.appendChild(this.labelDiv_);
  this.getPanes().overlayMouseTarget.appendChild(this.eventDiv_);
  // One cross is shared with all markers, so only add it once:
  if (typeof MarkerLabel_.getSharedCross.processed === "undefined") {
    this.getPanes().overlayImage.appendChild(this.crossDiv_);
    MarkerLabel_.getSharedCross.processed = true;
  }

  this.listeners_ = [
    google.maps.event.addDomListener(this.eventDiv_, "mouseover", function (e) {
      if (me.marker_.getDraggable() || me.marker_.getClickable()) {
        this.style.cursor = "pointer";
        google.maps.event.trigger(me.marker_, "mouseover", e);
      }
    }),
    google.maps.event.addDomListener(this.eventDiv_, "mouseout", function (e) {
      if ((me.marker_.getDraggable() || me.marker_.getClickable()) && !cDraggingLabel) {
        this.style.cursor = me.marker_.getCursor();
        google.maps.event.trigger(me.marker_, "mouseout", e);
      }
    }),
    google.maps.event.addDomListener(this.eventDiv_, "mousedown", function (e) {
      cDraggingLabel = false;
      if (me.marker_.getDraggable()) {
        cMouseIsDown = true;
        this.style.cursor = cDraggingCursor;
      }
      if (me.marker_.getDraggable() || me.marker_.getClickable()) {
        google.maps.event.trigger(me.marker_, "mousedown", e);
        cAbortEvent(e); // Prevent map pan when starting a drag on a label
      }
    }),
    google.maps.event.addDomListener(document, "mouseup", function (mEvent) {
      var position;
      if (cMouseIsDown) {
        cMouseIsDown = false;
        me.eventDiv_.style.cursor = "pointer";
        google.maps.event.trigger(me.marker_, "mouseup", mEvent);
      }
      if (cDraggingLabel) {
        if (cRaiseEnabled) { // Lower the marker & label
          position = me.getProjection().fromLatLngToDivPixel(me.marker_.getPosition());
          position.y += cRaiseOffset;
          me.marker_.setPosition(me.getProjection().fromDivPixelToLatLng(position));
          // This is not the same bouncing style as when the marker portion is dragged,
          // but it will have to do:
          try { // Will fail if running Google Maps API earlier than V3.3
            me.marker_.setAnimation(google.maps.Animation.BOUNCE);
            setTimeout(cStopBounce, 1406);
          } catch (e) {}
        }
        me.crossDiv_.style.display = "none";
        me.marker_.setZIndex(cSavedZIndex);
        cIgnoreClick = true; // Set flag to ignore the click event reported after a label drag
        cDraggingLabel = false;
        mEvent.latLng = me.marker_.getPosition();
        google.maps.event.trigger(me.marker_, "dragend", mEvent);
      }
    }),
    google.maps.event.addListener(me.marker_.getMap(), "mousemove", function (mEvent) {
      var position;
      if (cMouseIsDown) {
        if (cDraggingLabel) {
          // Change the reported location from the mouse position to the marker position:
          mEvent.latLng = new google.maps.LatLng(mEvent.latLng.lat() - cLatOffset, mEvent.latLng.lng() - cLngOffset);
          position = me.getProjection().fromLatLngToDivPixel(mEvent.latLng);
          if (cRaiseEnabled) {
            me.crossDiv_.style.left = position.x + "px";
            me.crossDiv_.style.top = position.y + "px";
            me.crossDiv_.style.display = "";
            position.y -= cRaiseOffset;
          }
          me.marker_.setPosition(me.getProjection().fromDivPixelToLatLng(position));
          if (cRaiseEnabled) { // Don't raise the veil; this hack needed to make MSIE act properly
            me.eventDiv_.style.top = (position.y + cRaiseOffset) + "px";
          }
          google.maps.event.trigger(me.marker_, "drag", mEvent);
        } else {
          // Calculate offsets from the click point to the marker position:
          cLatOffset = mEvent.latLng.lat() - me.marker_.getPosition().lat();
          cLngOffset = mEvent.latLng.lng() - me.marker_.getPosition().lng();
          cSavedZIndex = me.marker_.getZIndex();
          cStartPosition = me.marker_.getPosition();
          cStartCenter = me.marker_.getMap().getCenter();
          cRaiseEnabled = me.marker_.get("raiseOnDrag");
          cDraggingLabel = true;
          me.marker_.setZIndex(1000000); // Moves the marker & label to the foreground during a drag
          mEvent.latLng = me.marker_.getPosition();
          google.maps.event.trigger(me.marker_, "dragstart", mEvent);
        }
      }
    }),
    google.maps.event.addDomListener(document, "keydown", function (e) {
      if (cDraggingLabel) {
        if (e.keyCode === 27) { // Esc key
          cRaiseEnabled = false;
          me.marker_.setPosition(cStartPosition);
          me.marker_.getMap().setCenter(cStartCenter);
          google.maps.event.trigger(document, "mouseup", e);
        }
      }
    }),
    google.maps.event.addDomListener(this.eventDiv_, "click", function (e) {
      if (me.marker_.getDraggable() || me.marker_.getClickable()) {
        if (cIgnoreClick) { // Ignore the click reported when a label drag ends
          cIgnoreClick = false;
        } else {
          google.maps.event.trigger(me.marker_, "click", e);
          cAbortEvent(e); // Prevent click from being passed on to map
        }
      }
    }),
    google.maps.event.addDomListener(this.eventDiv_, "dblclick", function (e) {
      if (me.marker_.getDraggable() || me.marker_.getClickable()) {
        google.maps.event.trigger(me.marker_, "dblclick", e);
        cAbortEvent(e); // Prevent map zoom when double-clicking on a label
      }
    }),
    google.maps.event.addListener(this.marker_, "dragstart", function (mEvent) {
      if (!cDraggingLabel) {
        cRaiseEnabled = this.get("raiseOnDrag");
      }
    }),
    google.maps.event.addListener(this.marker_, "drag", function (mEvent) {
      if (!cDraggingLabel) {
        if (cRaiseEnabled) {
          me.setPosition(cRaiseOffset);
          // During a drag, the marker's z-index is temporarily set to 1000000 to
          // ensure it appears above all other markers. Also set the label's z-index
          // to 1000000 (plus or minus 1 depending on whether the label is supposed
          // to be above or below the marker).
          me.labelDiv_.style.zIndex = 1000000 + (this.get("labelInBackground") ? -1 : +1);
        }
      }
    }),
    google.maps.event.addListener(this.marker_, "dragend", function (mEvent) {
      if (!cDraggingLabel) {
        if (cRaiseEnabled) {
          me.setPosition(0); // Also restores z-index of label
        }
      }
    }),
    google.maps.event.addListener(this.marker_, "position_changed", function () {
      me.setPosition();
    }),
    google.maps.event.addListener(this.marker_, "zindex_changed", function () {
      me.setZIndex();
    }),
    google.maps.event.addListener(this.marker_, "visible_changed", function () {
      me.setVisible();
    }),
    google.maps.event.addListener(this.marker_, "labelvisible_changed", function () {
      me.setVisible();
    }),
    google.maps.event.addListener(this.marker_, "title_changed", function () {
      me.setTitle();
    }),
    google.maps.event.addListener(this.marker_, "labelcontent_changed", function () {
      me.setContent();
    }),
    google.maps.event.addListener(this.marker_, "labelanchor_changed", function () {
      me.setAnchor();
    }),
    google.maps.event.addListener(this.marker_, "labelclass_changed", function () {
      me.setStyles();
    }),
    google.maps.event.addListener(this.marker_, "labelstyle_changed", function () {
      me.setStyles();
    })
  ];
};

/**
 * Removes the DIV for the label from the DOM. It also removes all event handlers.
 * This method is called automatically when the marker's <code>setMap(null)</code>
 * method is called.
 * @private
 */
MarkerLabel_.prototype.onRemove = function () {
  var i;
  this.labelDiv_.parentNode.removeChild(this.labelDiv_);
  this.eventDiv_.parentNode.removeChild(this.eventDiv_);

  // Remove event listeners:
  for (i = 0; i < this.listeners_.length; i++) {
    google.maps.event.removeListener(this.listeners_[i]);
  }
};

/**
 * Draws the label on the map.
 * @private
 */
MarkerLabel_.prototype.draw = function () {
  this.setContent();
  this.setTitle();
  this.setStyles();
};

/**
 * Sets the content of the label.
 * The content can be plain text or an HTML DOM node.
 * @private
 */
MarkerLabel_.prototype.setContent = function () {
  var content = this.marker_.get("labelContent");
  if (typeof content.nodeType === "undefined") {
    this.labelDiv_.innerHTML = content;
    this.eventDiv_.innerHTML = this.labelDiv_.innerHTML;
  } else {
    this.labelDiv_.innerHTML = ""; // Remove current content
    this.labelDiv_.appendChild(content);
    content = content.cloneNode(true);
    this.eventDiv_.innerHTML = ""; // Remove current content
    this.eventDiv_.appendChild(content);
  }
};

/**
 * Sets the content of the tool tip for the label. It is
 * always set to be the same as for the marker itself.
 * @private
 */
MarkerLabel_.prototype.setTitle = function () {
  this.eventDiv_.title = this.marker_.getTitle() || "";
};

/**
 * Sets the style of the label by setting the style sheet and applying
 * other specific styles requested.
 * @private
 */
MarkerLabel_.prototype.setStyles = function () {
  var i, labelStyle;

  // Apply style values from the style sheet defined in the labelClass parameter:
  this.labelDiv_.className = this.marker_.get("labelClass");
  this.eventDiv_.className = this.labelDiv_.className;

  // Clear existing inline style values:
  this.labelDiv_.style.cssText = "";
  this.eventDiv_.style.cssText = "";
  // Apply style values defined in the labelStyle parameter:
  labelStyle = this.marker_.get("labelStyle");
  for (i in labelStyle) {
    if (labelStyle.hasOwnProperty(i)) {
      this.labelDiv_.style[i] = labelStyle[i];
      this.eventDiv_.style[i] = labelStyle[i];
    }
  }
  this.setMandatoryStyles();
};

/**
 * Sets the mandatory styles to the DIV representing the label as well as to the
 * associated event DIV. This includes setting the DIV position, z-index, and visibility.
 * @private
 */
MarkerLabel_.prototype.setMandatoryStyles = function () {
  this.labelDiv_.style.position = "absolute";
  this.labelDiv_.style.overflow = "hidden";
  // Make sure the opacity setting causes the desired effect on MSIE:
  if (typeof this.labelDiv_.style.opacity !== "undefined" && this.labelDiv_.style.opacity !== "") {
    this.labelDiv_.style.MsFilter = "\"progid:DXImageTransform.Microsoft.Alpha(opacity=" + (this.labelDiv_.style.opacity * 100) + ")\"";
    this.labelDiv_.style.filter = "alpha(opacity=" + (this.labelDiv_.style.opacity * 100) + ")";
  }

  this.eventDiv_.style.position = this.labelDiv_.style.position;
  this.eventDiv_.style.overflow = this.labelDiv_.style.overflow;
  this.eventDiv_.style.opacity = 0.01; // Don't use 0; DIV won't be clickable on MSIE
  this.eventDiv_.style.MsFilter = "\"progid:DXImageTransform.Microsoft.Alpha(opacity=1)\"";
  this.eventDiv_.style.filter = "alpha(opacity=1)"; // For MSIE

  this.setAnchor();
  this.setPosition(); // This also updates z-index, if necessary.
  this.setVisible();
};

/**
 * Sets the anchor point of the label.
 * @private
 */
MarkerLabel_.prototype.setAnchor = function () {
  var anchor = this.marker_.get("labelAnchor");
  this.labelDiv_.style.marginLeft = -anchor.x + "px";
  this.labelDiv_.style.marginTop = -anchor.y + "px";
  this.eventDiv_.style.marginLeft = -anchor.x + "px";
  this.eventDiv_.style.marginTop = -anchor.y + "px";
};

/**
 * Sets the position of the label. The z-index is also updated, if necessary.
 * @private
 */
MarkerLabel_.prototype.setPosition = function (yOffset) {
  var position = this.getProjection().fromLatLngToDivPixel(this.marker_.getPosition());
  if (typeof yOffset === "undefined") {
    yOffset = 0;
  }
  this.labelDiv_.style.left = Math.round(position.x) + "px";
  this.labelDiv_.style.top = Math.round(position.y - yOffset) + "px";
  this.eventDiv_.style.left = this.labelDiv_.style.left;
  this.eventDiv_.style.top = this.labelDiv_.style.top;

  this.setZIndex();
};

/**
 * Sets the z-index of the label. If the marker's z-index property has not been defined, the z-index
 * of the label is set to the vertical coordinate of the label. This is in keeping with the default
 * stacking order for Google Maps: markers to the south are in front of markers to the north.
 * @private
 */
MarkerLabel_.prototype.setZIndex = function () {
  var zAdjust = (this.marker_.get("labelInBackground") ? -1 : +1);
  if (typeof this.marker_.getZIndex() === "undefined") {
    this.labelDiv_.style.zIndex = parseInt(this.labelDiv_.style.top, 10) + zAdjust;
    this.eventDiv_.style.zIndex = this.labelDiv_.style.zIndex;
  } else {
    this.labelDiv_.style.zIndex = this.marker_.getZIndex() + zAdjust;
    this.eventDiv_.style.zIndex = this.labelDiv_.style.zIndex;
  }
};

/**
 * Sets the visibility of the label. The label is visible only if the marker itself is
 * visible (i.e., its visible property is true) and the labelVisible property is true.
 * @private
 */
MarkerLabel_.prototype.setVisible = function () {
  if (this.marker_.get("labelVisible")) {
    this.labelDiv_.style.display = this.marker_.getVisible() ? "block" : "none";
  } else {
    this.labelDiv_.style.display = "none";
  }
  this.eventDiv_.style.display = this.labelDiv_.style.display;
};

/**
 * @name MarkerWithLabelOptions
 * @class This class represents the optional parameter passed to the {@link MarkerWithLabel} constructor.
 *  The properties available are the same as for <code>google.maps.Marker</code> with the addition
 *  of the properties listed below. To change any of these additional properties after the labeled
 *  marker has been created, call <code>google.maps.Marker.set(propertyName, propertyValue)</code>.
 *  <p>
 *  When any of these properties changes, a property changed event is fired. The names of these
 *  events are derived from the name of the property and are of the form <code>propertyname_changed</code>.
 *  For example, if the content of the label changes, a <code>labelcontent_changed</code> event
 *  is fired.
 *  <p>
 * @property {string|Node} [labelContent] The content of the label (plain text or an HTML DOM node).
 * @property {Point} [labelAnchor] By default, a label is drawn with its anchor point at (0,0) so
 *  that its top left corner is positioned at the anchor point of the associated marker. Use this
 *  property to change the anchor point of the label. For example, to center a 50px-wide label
 *  beneath a marker, specify a <code>labelAnchor</code> of <code>google.maps.Point(25, 0)</code>.
 *  (Note: x-values increase to the right and y-values increase to the top.)
 * @property {string} [labelClass] The name of the CSS class defining the styles for the label.
 *  Note that style values for <code>position</code>, <code>overflow</code>, <code>top</code>,
 *  <code>left</code>, <code>zIndex</code>, <code>display</code>, <code>marginLeft</code>, and
 *  <code>marginTop</code> are ignored; these styles are for internal use only.
 * @property {Object} [labelStyle] An object literal whose properties define specific CSS
 *  style values to be applied to the label. Style values defined here override those that may
 *  be defined in the <code>labelClass</code> style sheet. If this property is changed after the
 *  label has been created, all previously set styles (except those defined in the style sheet)
 *  are removed from the label before the new style values are applied.
 *  Note that style values for <code>position</code>, <code>overflow</code>, <code>top</code>,
 *  <code>left</code>, <code>zIndex</code>, <code>display</code>, <code>marginLeft</code>, and
 *  <code>marginTop</code> are ignored; these styles are for internal use only.
 * @property {boolean} [labelInBackground] A flag indicating whether a label that overlaps its
 *  associated marker should appear in the background (i.e., in a plane below the marker).
 *  The default is <code>false</code>, which causes the label to appear in the foreground.
 * @property {boolean} [labelVisible] A flag indicating whether the label is to be visible.
 *  The default is <code>true</code>. Note that even if <code>labelVisible</code> is
 *  <code>true</code>, the label will <i>not</i> be visible unless the associated marker is also
 *  visible (i.e., unless the marker's <code>visible</code> property is <code>true</code>).
 * @property {boolean} [raiseOnDrag] A flag indicating whether the label and marker are to be
 *  raised when the marker is dragged. The default is <code>true</code>. If a draggable marker is
 *  being created and a version of Google Maps API earlier than V3.3 is being used, this property
 *  must be set to <code>false</code>.
 * @property {boolean} [optimized] A flag indicating whether rendering is to be optimized for the
 *  marker. <b>Important: The optimized rendering technique is not supported by MarkerWithLabel,
 *  so the value of this parameter is always forced to <code>false</code>.
 * @property {string} [crossImage="http://maps.gstatic.com/intl/en_us/mapfiles/drag_cross_67_16.png"]
 *  The URL of the cross image to be displayed while dragging a marker.
 * @property {string} [handCursor="http://maps.gstatic.com/intl/en_us/mapfiles/closedhand_8_8.cur"]
 *  The URL of the cursor to be displayed while dragging a marker.
 */
/**
 * Creates a MarkerWithLabel with the options specified in {@link MarkerWithLabelOptions}.
 * @constructor
 * @param {MarkerWithLabelOptions} [opt_options] The optional parameters.
 */
function MarkerWithLabel(opt_options) {
  opt_options = opt_options || {};
  opt_options.labelContent = opt_options.labelContent || "";
  opt_options.labelAnchor = opt_options.labelAnchor || new google.maps.Point(0, 0);
  opt_options.labelClass = opt_options.labelClass || "markerLabels";
  opt_options.labelStyle = opt_options.labelStyle || {};
  opt_options.labelInBackground = opt_options.labelInBackground || false;
  if (typeof opt_options.labelVisible === "undefined") {
    opt_options.labelVisible = true;
  }
  if (typeof opt_options.raiseOnDrag === "undefined") {
    opt_options.raiseOnDrag = true;
  }
  if (typeof opt_options.clickable === "undefined") {
    opt_options.clickable = true;
  }
  if (typeof opt_options.draggable === "undefined") {
    opt_options.draggable = false;
  }
  if (typeof opt_options.optimized === "undefined") {
    opt_options.optimized = false;
  }
  opt_options.crossImage = opt_options.crossImage || "http" + (document.location.protocol === "https:" ? "s" : "") + "://maps.gstatic.com/intl/en_us/mapfiles/drag_cross_67_16.png";
  opt_options.handCursor = opt_options.handCursor || "http" + (document.location.protocol === "https:" ? "s" : "") + "://maps.gstatic.com/intl/en_us/mapfiles/closedhand_8_8.cur";
  opt_options.optimized = false; // Optimized rendering is not supported

  this.label = new MarkerLabel_(this, opt_options.crossImage, opt_options.handCursor); // Bind the label to the marker

  // Call the parent constructor. It calls Marker.setValues to initialize, so all
  // the new parameters are conveniently saved and can be accessed with get/set.
  // Marker.set triggers a property changed event (called "propertyname_changed")
  // that the marker label listens for in order to react to state changes.
  google.maps.Marker.apply(this, arguments);
}

inherits(MarkerWithLabel, google.maps.Marker);

/**
 * Overrides the standard Marker setMap function.
 * @param {Map} theMap The map to which the marker is to be added.
 * @private
 */
MarkerWithLabel.prototype.setMap = function (theMap) {

  // Call the inherited function...
  google.maps.Marker.prototype.setMap.apply(this, arguments);

  // ... then deal with the label:
  this.label.setMap(theMap);
};
;
//Activate Tooltip
$(function() {
    $(document).tooltip({
        items: "[data-tooltip]",
        content: function() {
            var element = $(this);
            if ( element.is( "[data-tooltip]" ) ) {
              return element.attr("data-tooltip");
            }
        },
        position: {
            my: "center bottom-12",
            at: "center top",
            using: function( position, feedback ) {
                $(this).css(position);
                $("<div>")
                    .addClass("arrow")
                    .addClass(feedback.vertical)
                    .addClass(feedback.horizontal)
                    .appendTo(this);
            }
        },
        show: {
            delay: 200,
            duration: 200
        }
    });
});
;
/*!
 * jQuery Cookie Plugin v1.3.1
 * https://github.com/carhartl/jquery-cookie
 *
 * Copyright 2013 Klaus Hartl
 * Released under the MIT license
 */
(function (factory) {
	if (typeof define === 'function' && define.amd) {
		// AMD. Register as anonymous module.
		define(['jquery'], factory);
	} else {
		// Browser globals.
		factory(jQuery);
	}
}(function ($) {

	var pluses = /\+/g;

	function raw(s) {
		return s;
	}

	function decoded(s) {
		return decodeURIComponent(s.replace(pluses, ' '));
	}

	function converted(s) {
		if (s.indexOf('"') === 0) {
			// This is a quoted cookie as according to RFC2068, unescape
			s = s.slice(1, -1).replace(/\\"/g, '"').replace(/\\\\/g, '\\');
		}
		try {
			return config.json ? JSON.parse(s) : s;
		} catch(er) {}
	}

	var config = $.cookie = function (key, value, options) {

		// write
		if (value !== undefined) {
			options = $.extend({}, config.defaults, options);

			if (typeof options.expires === 'number') {
				var days = options.expires, t = options.expires = new Date();
				t.setDate(t.getDate() + days);
			}

			value = config.json ? JSON.stringify(value) : String(value);

			return (document.cookie = [
				config.raw ? key : encodeURIComponent(key),
				'=',
				config.raw ? value : encodeURIComponent(value),
				options.expires ? '; expires=' + options.expires.toUTCString() : '', // use expires attribute, max-age is not supported by IE
				options.path    ? '; path=' + options.path : '',
				options.domain  ? '; domain=' + options.domain : '',
				options.secure  ? '; secure' : ''
			].join(''));
		}

		// read
		var decode = config.raw ? raw : decoded;
		var cookies = document.cookie.split('; ');
		var result = key ? undefined : {};
		for (var i = 0, l = cookies.length; i < l; i++) {
			var parts = cookies[i].split('=');
			var name = decode(parts.shift());
			var cookie = decode(parts.join('='));

			if (key && key === name) {
				result = converted(cookie);
				break;
			}

			if (!key) {
				result[name] = converted(cookie);
			}
		}

		return result;
	};

	config.defaults = {};

	$.removeCookie = function (key, options) {
		if ($.cookie(key) !== undefined) {
			// Must not alter options, thus extending a fresh object...
			$.cookie(key, '', $.extend({}, options, { expires: -1 }));
			return true;
		}
		return false;
	};

}));;
/*
 * jQuery JSONP Core Plugin 2.4.0 (2012-08-21)
 *
 * https://github.com/jaubourg/jquery-jsonp
 *
 * Copyright (c) 2012 Julian Aubourg
 *
 * This document is licensed as free software under the terms of the
 * MIT License: http://www.opensource.org/licenses/mit-license.php
 */
( function( $ ) {

	// ###################### UTILITIES ##

	// Noop
	function noop() {
	}

	// Generic callback
	function genericCallback( data ) {
		lastValue = [ data ];
	}

	// Call if defined
	function callIfDefined( method , object , parameters ) {
		return method && method.apply( object.context || object , parameters );
	}

	// Give joining character given url
	function qMarkOrAmp( url ) {
		return /\?/ .test( url ) ? "&" : "?";
	}

	var // String constants (for better minification)
		STR_ASYNC = "async",
		STR_CHARSET = "charset",
		STR_EMPTY = "",
		STR_ERROR = "error",
		STR_INSERT_BEFORE = "insertBefore",
		STR_JQUERY_JSONP = "_jqjsp",
		STR_ON = "on",
		STR_ON_CLICK = STR_ON + "click",
		STR_ON_ERROR = STR_ON + STR_ERROR,
		STR_ON_LOAD = STR_ON + "load",
		STR_ON_READY_STATE_CHANGE = STR_ON + "readystatechange",
		STR_READY_STATE = "readyState",
		STR_REMOVE_CHILD = "removeChild",
		STR_SCRIPT_TAG = "<script>",
		STR_SUCCESS = "success",
		STR_TIMEOUT = "timeout",

		// Window
		win = window,
		// Deferred
		Deferred = $.Deferred,
		// Head element
		head = $( "head" )[ 0 ] || document.documentElement,
		// Page cache
		pageCache = {},
		// Counter
		count = 0,
		// Last returned value
		lastValue,

		// ###################### DEFAULT OPTIONS ##
		xOptionsDefaults = {
			//beforeSend: undefined,
			//cache: false,
			callback: STR_JQUERY_JSONP,
			//callbackParameter: undefined,
			//charset: undefined,
			//complete: undefined,
			//context: undefined,
			//data: "",
			//dataFilter: undefined,
			//error: undefined,
			//pageCache: false,
			//success: undefined,
			//timeout: 0,
			//traditional: false,
			url: location.href
		},

		// opera demands sniffing :/
		opera = win.opera,

		// IE < 10
		oldIE = !!$( "<div>" ).html( "<!--[if IE]><i><![endif]-->" ).find("i").length;

	// ###################### MAIN FUNCTION ##
	function jsonp( xOptions ) {

		// Build data with default
		xOptions = $.extend( {} , xOptionsDefaults , xOptions );

		// References to xOptions members (for better minification)
		var successCallback = xOptions.success,
			errorCallback = xOptions.error,
			completeCallback = xOptions.complete,
			dataFilter = xOptions.dataFilter,
			callbackParameter = xOptions.callbackParameter,
			successCallbackName = xOptions.callback,
			cacheFlag = xOptions.cache,
			pageCacheFlag = xOptions.pageCache,
			charset = xOptions.charset,
			url = xOptions.url,
			data = xOptions.data,
			timeout = xOptions.timeout,
			pageCached,

			// Abort/done flag
			done = 0,

			// Life-cycle functions
			cleanUp = noop,

			// Support vars
			supportOnload,
			supportOnreadystatechange,

			// Request execution vars
			firstChild,
			script,
			scriptAfter,
			timeoutTimer;

		// If we have Deferreds:
		// - substitute callbacks
		// - promote xOptions to a promise
		Deferred && Deferred(function( defer ) {
			defer.done( successCallback ).fail( errorCallback );
			successCallback = defer.resolve;
			errorCallback = defer.reject;
		}).promise( xOptions );

		// Create the abort method
		xOptions.abort = function() {
			!( done++ ) && cleanUp();
		};

		// Call beforeSend if provided (early abort if false returned)
		if ( callIfDefined( xOptions.beforeSend , xOptions , [ xOptions ] ) === !1 || done ) {
			return xOptions;
		}

		// Control entries
		url = url || STR_EMPTY;
		data = data ? ( (typeof data) == "string" ? data : $.param( data , xOptions.traditional ) ) : STR_EMPTY;

		// Build final url
		url += data ? ( qMarkOrAmp( url ) + data ) : STR_EMPTY;

		// Add callback parameter if provided as option
		callbackParameter && ( url += qMarkOrAmp( url ) + encodeURIComponent( callbackParameter ) + "=?" );

		// Add anticache parameter if needed
		!cacheFlag && !pageCacheFlag && ( url += qMarkOrAmp( url ) + "_" + ( new Date() ).getTime() + "=" );

		// Replace last ? by callback parameter
		url = url.replace( /=\?(&|$)/ , "=" + successCallbackName + "$1" );

		// Success notifier
		function notifySuccess( json ) {

			if ( !( done++ ) ) {

				cleanUp();
				// Pagecache if needed
				pageCacheFlag && ( pageCache [ url ] = { s: [ json ] } );
				// Apply the data filter if provided
				dataFilter && ( json = dataFilter.apply( xOptions , [ json ] ) );
				// Call success then complete
				callIfDefined( successCallback , xOptions , [ json , STR_SUCCESS, xOptions ] );
				callIfDefined( completeCallback , xOptions , [ xOptions , STR_SUCCESS ] );

			}
		}

		// Error notifier
		function notifyError( type ) {

			if ( !( done++ ) ) {

				// Clean up
				cleanUp();
				// If pure error (not timeout), cache if needed
				pageCacheFlag && type != STR_TIMEOUT && ( pageCache[ url ] = type );
				// Call error then complete
				callIfDefined( errorCallback , xOptions , [ xOptions , type ] );
				callIfDefined( completeCallback , xOptions , [ xOptions , type ] );

			}
		}

		// Check page cache
		if ( pageCacheFlag && ( pageCached = pageCache[ url ] ) ) {

			pageCached.s ? notifySuccess( pageCached.s[ 0 ] ) : notifyError( pageCached );

		} else {

			// Install the generic callback
			// (BEWARE: global namespace pollution ahoy)
			win[ successCallbackName ] = genericCallback;

			// Create the script tag
			script = $( STR_SCRIPT_TAG )[ 0 ];
			script.id = STR_JQUERY_JSONP + count++;

			// Set charset if provided
			if ( charset ) {
				script[ STR_CHARSET ] = charset;
			}

			opera && opera.version() < 11.60 ?
				// onerror is not supported: do not set as async and assume in-order execution.
				// Add a trailing script to emulate the event
				( ( scriptAfter = $( STR_SCRIPT_TAG )[ 0 ] ).text = "document.getElementById('" + script.id + "')." + STR_ON_ERROR + "()" )
			:
				// onerror is supported: set the script as async to avoid requests blocking each others
				( script[ STR_ASYNC ] = STR_ASYNC )

			;

			// Internet Explorer: event/htmlFor trick
			if ( oldIE ) {
				script.htmlFor = script.id;
				script.event = STR_ON_CLICK;
			}

			// Attached event handlers
			script[ STR_ON_LOAD ] = script[ STR_ON_ERROR ] = script[ STR_ON_READY_STATE_CHANGE ] = function ( result ) {

				// Test readyState if it exists
				if ( !script[ STR_READY_STATE ] || !/i/.test( script[ STR_READY_STATE ] ) ) {

					try {

						script[ STR_ON_CLICK ] && script[ STR_ON_CLICK ]();

					} catch( _ ) {}

					result = lastValue;
					lastValue = 0;
					result ? notifySuccess( result[ 0 ] ) : notifyError( STR_ERROR );

				}
			};

			// Set source
			script.src = url;

			// Re-declare cleanUp function
			cleanUp = function( i ) {
				timeoutTimer && clearTimeout( timeoutTimer );
				script[ STR_ON_READY_STATE_CHANGE ] = script[ STR_ON_LOAD ] = script[ STR_ON_ERROR ] = null;
				head[ STR_REMOVE_CHILD ]( script );
				scriptAfter && head[ STR_REMOVE_CHILD ]( scriptAfter );
			};

			// Append main script
			head[ STR_INSERT_BEFORE ]( script , ( firstChild = head.firstChild ) );

			// Append trailing script if needed
			scriptAfter && head[ STR_INSERT_BEFORE ]( scriptAfter , firstChild );

			// If a timeout is needed, install it
			timeoutTimer = timeout > 0 && setTimeout( function() {
				notifyError( STR_TIMEOUT );
			} , timeout );

		}

		return xOptions;
	}

	// ###################### SETUP FUNCTION ##
	jsonp.setup = function( xOptions ) {
		$.extend( xOptionsDefaults , xOptions );
	};

	// ###################### INSTALL in jQuery ##
	$.jsonp = jsonp;

} )( jQuery );;

$.windowActive = true;

$.isWindowActive = function () {
    return $.windowActive;
};

$(window).focus(function() {
    $.windowActive = true;
});

$(window).blur(function() {
    $.windowActive = false;
});;
/*!
 * jquery.customSelect() - v0.4.2
 * http://adam.co/lab/jquery/customselect/
 * 2013-05-22
 *
 * Copyright 2013 Adam Coulombe
 * @license http://www.opensource.org/licenses/mit-license.html MIT License
 * @license http://www.gnu.org/licenses/gpl.html GPL2 License
 */

(function ($) {
    'use strict';

    $.fn.extend({
        customSelect: function (options) {
            // filter out <= IE6
            if (typeof document.body.style.maxHeight === 'undefined') {
                return this;
            }
            var defaults = {
                    customClass: 'customSelect',
                    mapClass:    true,
                    mapStyle:    true
            },
            options = $.extend(defaults, options),
            prefix = options.customClass,
            changed = function ($select,customSelectSpan) {
                var currentSelected = $select.find(':selected'),
                customSelectSpanInner = customSelectSpan.children(':first'),
                html = currentSelected.html() || '&nbsp;';

                customSelectSpanInner.html(html);

                if (currentSelected.attr('disabled')) {
                	customSelectSpan.addClass(getClass('DisabledOption'));
                } else {
                	customSelectSpan.removeClass(getClass('DisabledOption'));
                }

                setTimeout(function () {
                    customSelectSpan.removeClass(getClass('Open'));
                    $(document).off('mouseup.'+getClass('Open'));
                }, 60);
            },
            getClass = function(suffix){
                return prefix + suffix;
            };

            return this.each(function () {
                var $select = $(this),
                    customSelectInnerSpan = $('<span />').addClass(getClass('Inner')),
                    customSelectSpan = $('<span />');

                customSelectSpan.addClass(prefix);

                if (options.mapClass) {
                    customSelectSpan.addClass($select.attr('class'));
                }
                if (options.mapStyle) {
                    customSelectSpan.attr('style', $select.attr('style'));
                }

                $select
                    .addClass('hasCustomSelect')
                    .on('update', function () {
						changed($select,customSelectSpan);

                        var selectBoxWidth = parseInt($select.outerWidth(), 10) -
                                (parseInt(customSelectSpan.outerWidth(), 10) -
                                    parseInt(customSelectSpan.width(), 10));

						// Set to inline-block before calculating outerHeight
						customSelectSpan.css({
                            display: 'inline-block'
                        });

                        var selectBoxHeight = customSelectSpan.outerHeight();

                        if ($select.attr('disabled')) {
                            customSelectSpan.addClass(getClass('Disabled'));
                        } else {
                            customSelectSpan.removeClass(getClass('Disabled'));
                        }

                        customSelectInnerSpan.css({
                            width:   selectBoxWidth,
                            display: 'inline-block'
                        });

                        $select.css({
                            '-webkit-appearance': 'menulist-button',
                            width:                customSelectSpan.outerWidth(),
                            position:             'absolute',
                            opacity:              0,
                            height:               selectBoxHeight,
                            fontSize:             customSelectSpan.css('font-size'),
                            top:                  0,
                            left:                 0
                        });
                    })
                    .on('change', function () {
                        customSelectSpan.addClass(getClass('Changed'));
                        changed($select,customSelectSpan);
                    })
                    .on('keyup', function (e) {
                        if(!customSelectSpan.hasClass(getClass('Open'))){
                            $select.blur();
                            $select.focus();
                        }else{
                            if(e.which==13||e.which==27||e.which==9){
                                changed($select,customSelectSpan);
                            }
                        }
                    })
                    .on('mousedown', function (e) {
                        customSelectSpan.removeClass(getClass('Changed'));
                    })
                    .on('mouseup', function (e) {

                        if( !customSelectSpan.hasClass(getClass('Open'))){
                            // if FF and there are other selects open, just apply focus
                            if($('.'+getClass('Open')).not(customSelectSpan).length>0 && typeof InstallTrigger !== 'undefined'){
                                $select.focus();
                            }else{
                                customSelectSpan.addClass(getClass('Open'));
                                e.stopPropagation();
                                $(document).one('mouseup.'+getClass('Open'), function (e) {
                                    if( e.target != $select.get(0) && $.inArray(e.target,$select.find('*').get()) < 0 ){
                                        $select.blur();
                                    }else{
                                        changed($select,customSelectSpan);
                                    }
                                });
                            }
                        }
                    })
                    .focus(function () {
                        customSelectSpan.removeClass(getClass('Changed')).addClass(getClass('Focus'));
                    })
                    .blur(function () {
                        customSelectSpan.removeClass(getClass('Focus')+' '+getClass('Open'));
                    })
                    .hover(function () {
                        customSelectSpan.addClass(getClass('Hover'));
                    }, function () {
                        customSelectSpan.removeClass(getClass('Hover'));
                    })
                    .wrap('<div style="position:relative" />')
                    .parent("div").append(customSelectSpan.append(customSelectInnerSpan))
                    .find("select").trigger('update');
            });
        }
    });
})(jQuery);
;
/*
 * A JavaScript implementation of the RSA Data Security, Inc. MD5 Message
 * Digest Algorithm, as defined in RFC 1321.
 * Version 2.2 Copyright (C) Paul Johnston 1999 - 2009
 * Other contributors: Greg Holt, Andrew Kepert, Ydnar, Lostinet
 * Distributed under the BSD License
 * See http://pajhome.org.uk/crypt/md5 for more info.
 */
var hexcase=0;function hex_md5(a){return rstr2hex(rstr_md5(str2rstr_utf8(a)))}function hex_hmac_md5(a,b){return rstr2hex(rstr_hmac_md5(str2rstr_utf8(a),str2rstr_utf8(b)))}function md5_vm_test(){return hex_md5("abc").toLowerCase()=="900150983cd24fb0d6963f7d28e17f72"}function rstr_md5(a){return binl2rstr(binl_md5(rstr2binl(a),a.length*8))}function rstr_hmac_md5(c,f){var e=rstr2binl(c);if(e.length>16){e=binl_md5(e,c.length*8)}var a=Array(16),d=Array(16);for(var b=0;b<16;b++){a[b]=e[b]^909522486;d[b]=e[b]^1549556828}var g=binl_md5(a.concat(rstr2binl(f)),512+f.length*8);return binl2rstr(binl_md5(d.concat(g),512+128))}function rstr2hex(c){try{hexcase}catch(g){hexcase=0}var f=hexcase?"0123456789ABCDEF":"0123456789abcdef";var b="";var a;for(var d=0;d<c.length;d++){a=c.charCodeAt(d);b+=f.charAt((a>>>4)&15)+f.charAt(a&15)}return b}function str2rstr_utf8(c){var b="";var d=-1;var a,e;while(++d<c.length){a=c.charCodeAt(d);e=d+1<c.length?c.charCodeAt(d+1):0;if(55296<=a&&a<=56319&&56320<=e&&e<=57343){a=65536+((a&1023)<<10)+(e&1023);d++}if(a<=127){b+=String.fromCharCode(a)}else{if(a<=2047){b+=String.fromCharCode(192|((a>>>6)&31),128|(a&63))}else{if(a<=65535){b+=String.fromCharCode(224|((a>>>12)&15),128|((a>>>6)&63),128|(a&63))}else{if(a<=2097151){b+=String.fromCharCode(240|((a>>>18)&7),128|((a>>>12)&63),128|((a>>>6)&63),128|(a&63))}}}}}return b}function rstr2binl(b){var a=Array(b.length>>2);for(var c=0;c<a.length;c++){a[c]=0}for(var c=0;c<b.length*8;c+=8){a[c>>5]|=(b.charCodeAt(c/8)&255)<<(c%32)}return a}function binl2rstr(b){var a="";for(var c=0;c<b.length*32;c+=8){a+=String.fromCharCode((b[c>>5]>>>(c%32))&255)}return a}function binl_md5(p,k){p[k>>5]|=128<<((k)%32);p[(((k+64)>>>9)<<4)+14]=k;var o=1732584193;var n=-271733879;var m=-1732584194;var l=271733878;for(var g=0;g<p.length;g+=16){var j=o;var h=n;var f=m;var e=l;o=md5_ff(o,n,m,l,p[g+0],7,-680876936);l=md5_ff(l,o,n,m,p[g+1],12,-389564586);m=md5_ff(m,l,o,n,p[g+2],17,606105819);n=md5_ff(n,m,l,o,p[g+3],22,-1044525330);o=md5_ff(o,n,m,l,p[g+4],7,-176418897);l=md5_ff(l,o,n,m,p[g+5],12,1200080426);m=md5_ff(m,l,o,n,p[g+6],17,-1473231341);n=md5_ff(n,m,l,o,p[g+7],22,-45705983);o=md5_ff(o,n,m,l,p[g+8],7,1770035416);l=md5_ff(l,o,n,m,p[g+9],12,-1958414417);m=md5_ff(m,l,o,n,p[g+10],17,-42063);n=md5_ff(n,m,l,o,p[g+11],22,-1990404162);o=md5_ff(o,n,m,l,p[g+12],7,1804603682);l=md5_ff(l,o,n,m,p[g+13],12,-40341101);m=md5_ff(m,l,o,n,p[g+14],17,-1502002290);n=md5_ff(n,m,l,o,p[g+15],22,1236535329);o=md5_gg(o,n,m,l,p[g+1],5,-165796510);l=md5_gg(l,o,n,m,p[g+6],9,-1069501632);m=md5_gg(m,l,o,n,p[g+11],14,643717713);n=md5_gg(n,m,l,o,p[g+0],20,-373897302);o=md5_gg(o,n,m,l,p[g+5],5,-701558691);l=md5_gg(l,o,n,m,p[g+10],9,38016083);m=md5_gg(m,l,o,n,p[g+15],14,-660478335);n=md5_gg(n,m,l,o,p[g+4],20,-405537848);o=md5_gg(o,n,m,l,p[g+9],5,568446438);l=md5_gg(l,o,n,m,p[g+14],9,-1019803690);m=md5_gg(m,l,o,n,p[g+3],14,-187363961);n=md5_gg(n,m,l,o,p[g+8],20,1163531501);o=md5_gg(o,n,m,l,p[g+13],5,-1444681467);l=md5_gg(l,o,n,m,p[g+2],9,-51403784);m=md5_gg(m,l,o,n,p[g+7],14,1735328473);n=md5_gg(n,m,l,o,p[g+12],20,-1926607734);o=md5_hh(o,n,m,l,p[g+5],4,-378558);l=md5_hh(l,o,n,m,p[g+8],11,-2022574463);m=md5_hh(m,l,o,n,p[g+11],16,1839030562);n=md5_hh(n,m,l,o,p[g+14],23,-35309556);o=md5_hh(o,n,m,l,p[g+1],4,-1530992060);l=md5_hh(l,o,n,m,p[g+4],11,1272893353);m=md5_hh(m,l,o,n,p[g+7],16,-155497632);n=md5_hh(n,m,l,o,p[g+10],23,-1094730640);o=md5_hh(o,n,m,l,p[g+13],4,681279174);l=md5_hh(l,o,n,m,p[g+0],11,-358537222);m=md5_hh(m,l,o,n,p[g+3],16,-722521979);n=md5_hh(n,m,l,o,p[g+6],23,76029189);o=md5_hh(o,n,m,l,p[g+9],4,-640364487);l=md5_hh(l,o,n,m,p[g+12],11,-421815835);m=md5_hh(m,l,o,n,p[g+15],16,530742520);n=md5_hh(n,m,l,o,p[g+2],23,-995338651);o=md5_ii(o,n,m,l,p[g+0],6,-198630844);l=md5_ii(l,o,n,m,p[g+7],10,1126891415);m=md5_ii(m,l,o,n,p[g+14],15,-1416354905);n=md5_ii(n,m,l,o,p[g+5],21,-57434055);o=md5_ii(o,n,m,l,p[g+12],6,1700485571);l=md5_ii(l,o,n,m,p[g+3],10,-1894986606);m=md5_ii(m,l,o,n,p[g+10],15,-1051523);n=md5_ii(n,m,l,o,p[g+1],21,-2054922799);o=md5_ii(o,n,m,l,p[g+8],6,1873313359);l=md5_ii(l,o,n,m,p[g+15],10,-30611744);m=md5_ii(m,l,o,n,p[g+6],15,-1560198380);n=md5_ii(n,m,l,o,p[g+13],21,1309151649);o=md5_ii(o,n,m,l,p[g+4],6,-145523070);l=md5_ii(l,o,n,m,p[g+11],10,-1120210379);m=md5_ii(m,l,o,n,p[g+2],15,718787259);n=md5_ii(n,m,l,o,p[g+9],21,-343485551);o=safe_add(o,j);n=safe_add(n,h);m=safe_add(m,f);l=safe_add(l,e)}return Array(o,n,m,l)}function md5_cmn(h,e,d,c,g,f){return safe_add(bit_rol(safe_add(safe_add(e,h),safe_add(c,f)),g),d)}function md5_ff(g,f,k,j,e,i,h){return md5_cmn((f&k)|((~f)&j),g,f,e,i,h)}function md5_gg(g,f,k,j,e,i,h){return md5_cmn((f&j)|(k&(~j)),g,f,e,i,h)}function md5_hh(g,f,k,j,e,i,h){return md5_cmn(f^k^j,g,f,e,i,h)}function md5_ii(g,f,k,j,e,i,h){return md5_cmn(k^(f|(~j)),g,f,e,i,h)}function safe_add(a,d){var c=(a&65535)+(d&65535);var b=(a>>16)+(d>>16)+(c>>16);return(b<<16)|(c&65535)}function bit_rol(a,b){return(a<<b)|(a>>>(32-b))};;
/* jshint browser: true, camelcase: false, devel:true, jquery:true */

'use strict';

/** Utility for correlated start / end date time selectors.
 *
 * Currently assumes fields coming from two external picker utilities:
 * - http://www.eyecon.ro/bootstrap-datepicker
 * - http://jonthornton.github.io/jquery-timepicker/
 */

var DatePair = function (shouldSetToNow, dateTimeObjects,
    highlightAdvance, hoursToAdd) {

    /** DOM state used by DatePair.
     *
     * DatePair sits upon a boot strap date picker and a JQuery time
     * picker. Start and end versions of these pickers provide the UI
     * for the user and contain all data.
     *
     */

    //Check If start and end dateTime jQuery Objects were passed in
    if (dateTimeObjects) {
        this.startDate = dateTimeObjects.dateStart;
        this.endDate = dateTimeObjects.dateEnd;
        this.startTime = dateTimeObjects.timeStart;
        this.endTime = dateTimeObjects.timeEnd;
    } else if (hoursToAdd === 'historical') {
        this.startDate = $('.op_dt_date_start').first();
        this.endDate = $('.op_dt_date_end').first();
        this.startTime = $('.op_dt_time_start').first();
        this.endTime = $('.op_dt_time_end').first();
    } else {
        this.startDate = $('.dt_date_start').first();
        this.endDate = $('.dt_date_end').first();
        this.startTime = $('.dt_time_start').first();
        this.endTime = $('.dt_time_end').first();
    }

    this.priorTimeDelta = NaN;

    /** Hook logic into DOM and optionally set initial date time data.
     */
    this.initialize = function (shouldSetToNow, hoursToAdd) {

        // Fix bug with the way Bootstrap overlays carets
        $('.caret, .arrow_down').on('click', function() {
            $(this).siblings().trigger('click');
        });

        // Associate DatePair with elements on page.
        this.hookUpWidgets();

        // Sets the start time to now and
        // either 1 hr or [n] hrs from now.
        if (shouldSetToNow) {
            this.setToNow();
        } else if (hoursToAdd === 'historical') {
            this.addHours('historical');
        } else {
            this.addHours(hoursToAdd);
        }

        // Finally, kick the update logic once.
        this.verifyStartEnd();
    };

    this.setStart = function (dontRound) {
        var now,
            inOneHour,
            quarterHours,
            rounded;

        // Calculate 'now' to the nearest quarter hour
        now = new Date();

        if (!dontRound) {
            quarterHours = Math.round(now.getMinutes() / 15);
            if (quarterHours === 4) {
                now.setHours(now.getHours() + 1);
            }
            rounded = (quarterHours * 15) % 60;
            now.setMinutes(rounded);
        }

        // Calculate one hour from 'now'
        inOneHour = new Date(now.getTime() + this.oneHourMS);

        return {
            now: now,
            rounded: rounded,
            inOneHour: inOneHour
        };
    };

    /** Set entry time to now with a duration of one hour.
     */
    this.setToNow = function () {
        var times = this.setStart();

        // Update widget state
        this.setStartDateTime(times.now);
        this.setEndDateTime(times.inOneHour);
        this.updateEndTime(times.now - times.inOneHour);
    };

    this.addHours = function (hoursToAdd) {
        var times = this.setStart(true), // true === don't round start time.
            newDate = new Date();

        if (hoursToAdd === 'historical') {
            // Set the start date to 24 hours in the past.
            this.setStartDateTime(
                new Date(newDate.setDate(newDate.getDate() - 1))
            );

            // Update the end date to now.
            this.setEndDateTime(times.now);
        } else {
            // Update the start date to now.
            this.setStartDateTime(times.now);

            // Set the end date to n number of hours ahead.
            this.setEndDateTime(
                new Date(newDate.setHours(newDate.getHours() + hoursToAdd))
            );
        }
    };

    /** Utility configuring widgets associated with DOM elements.
     */
    this.hookUpWidgets = function () {
        var thisDatePair = this;
        // Start date and time
        this.startDate.datepicker(DatePair.datePickerOptions).change(function () {
            //thisDatePair.updateEndTime(thisDatePair.priorTimeDelta);
            thisDatePair.verifyStartEnd();    // Update text box

            if (highlightAdvance) {
                thisDatePair.startTime[0].focus();    // Highlight time stamp
            }
        });
        this.startTime.timepicker(DatePair.timePickerOptions).change(function () {
            //thisDatePair.updateEndTime(thisDatePair.priorTimeDelta);
            thisDatePair.verifyStartEnd();    // Update text box

            // Un-focus input field
            this.blur();
        });

        // End date and time
        this.endDate.datepicker(DatePair.datePickerOptions).change(function () {
            thisDatePair.verifyStartEnd();   // Update text box
            thisDatePair.priorTimeDelta = thisDatePair.getTimeDelta();
            thisDatePair.updateEndTime(thisDatePair.priorTimeDelta);

            if (highlightAdvance) {
                thisDatePair.endTime[0].focus();    // Highlight time stamp
            }
        }).data('datepicker');
        this.endTime.timepicker(DatePair.timePickerOptions).change(function () {
            // if we accidentally loop around midnight...
            // then subtract 24 hours (86400 seconds) from the delta
            if (thisDatePair.priorTimeDelta <= 86400 && thisDatePair.getTimeDelta() >= 86400) {
                thisDatePair.priorTimeDelta = thisDatePair.getTimeDelta() - 86400;
            } else {
                thisDatePair.priorTimeDelta = thisDatePair.getTimeDelta();
            }
            thisDatePair.updateEndTime(thisDatePair.priorTimeDelta);
            thisDatePair.verifyStartEnd();    // Update text box

            // Un-focus input field
            this.blur();
        });
    };

    /** Adjust end time to maintain constant timeDelta from start time.
     *
     * Expected behavior of the DatePair widget is that a change to the
     * start time will result in a modified end time such that the
     * timeDelta between start and end remains constant.
     *
     * @param {number} Time delta in seconds that should exist between
     * start and end date time.
     */
    this.updateEndTime = function (timeDelta) {
        var startSeconds,
            endDateTime;
        if (isNaN(timeDelta) || timeDelta <= 0) {
            timeDelta = this.oneHourMS / 1000;
        }
        endDateTime = new Date(
                this.getStartDateTime().getTime() +
                timeDelta * 1000);
        this.setEndDateTime(endDateTime);
        // If time delta is less than one day then show duration in
        // end time picker, else use a minimal display.
        if (timeDelta < (this.oneHourMS * 24 / 1000)) {
            startSeconds = this.startTime.timepicker('getSecondsFromMidnight');
            this.endTime.timepicker('option', 'minTime', startSeconds + 30 * 60);
            this.endTime.timepicker('option', 'maxTime', '11:30pm');
            this.endTime.timepicker('option', 'durationTime', startSeconds);
            this.endTime.timepicker('option', 'showDuration', true);
        } else {
            this.endTime.timepicker('option', 'minTime', null);
            this.endTime.timepicker('option', 'maxTime', null);
            this.endTime.timepicker('option', 'showDuration', false);
        }
    };

    /** Calculate time delta between start and end date times.
     *
     * @returns {number|NaN} Time delta in seconds.  Return NaN if one
     * of start or end date is not well defined.
     */
    this.getTimeDelta = function () {
        var datetimeDelta;
        // Determine the datetime delta
        datetimeDelta = (this.getEndDateTime() - this.getStartDateTime()) / 1000;
        return datetimeDelta;
    };

    // Takes the start or end date of the lot,
    // gets the remainder of the two offsets
    // and returns a new date with the factored offset.
    this.compensateForDST = function (date) {
        var internalDate = new Date(date),
            newDate = new Date(),
            newDateOffset = newDate.getTimezoneOffset(),
            internalDateOffset = internalDate.getTimezoneOffset(),
            offset = (internalDateOffset - newDateOffset) * 60000,
            internalDateEpoch = internalDate.getTime(),
            combinedTime = internalDateEpoch + offset,
            combinedDate = new Date(combinedTime);

        return combinedDate;
    };

    /** Accessor to get the start Date object.
     *
     * returns {Date} Date and time of start.
     */
    this.getStartDateTime = function () {
        var date,
            startDate,
            startSeconds,
            internalDate = this.startDate.datepicker('getDate');

        startDate = new Date(internalDate);
        startSeconds = this.startTime.timepicker('getSecondsFromMidnight');
        date = new Date(startDate.getTime() + startSeconds * 1000);

        // Only compensate for DST if the offsets don't match.
        if (startDate.getTimezoneOffset() !== date.getTimezoneOffset()) {
            return this.compensateForDST(date);
        } else {
            return date;
        }
    };

    /** Accessor to get the end Date object.
     *
     * returns {Date} Date and time of end.
     */
    this.getEndDateTime = function () {
        var date,
            endDate,
            endSeconds,
            internalDate = this.endDate.datepicker('getDate');

        endDate = new Date(internalDate);
        endSeconds = this.endTime.timepicker('getSecondsFromMidnight');
        date = new Date(endDate.getTime()  + endSeconds * 1000);

        // Only compensate for DST if the offsets don't match.
        if (endDate.getTimezoneOffset() !== date.getTimezoneOffset()) {
            return this.compensateForDST(date);
        } else {
            return date;
        }
    };

    /** Set the start data from Date object.
     *
     * param {Date} Start Date object.
     */
    this.setStartDateTime = function (date) {
        var startDate = new Date(date.getFullYear(), date.getMonth(), date.getDate());

        // Check for NaN.. should be logging an error here
        if (isNaN(startDate)) {
            return;
        }

        this.startDate.data('datepicker').setDate(startDate);
        this.startTime.timepicker('setTime', date);
    };

    /** Set the end data from Date object.
     *
     * param {Date} End Date object.
     */
    this.setEndDateTime = function (date) {
        var endDate = new Date(date.getFullYear(), date.getMonth(), date.getDate());

        // Check for NaN.. should be logging an error here
        if (isNaN(endDate)) {
            return;
        }

        this.endDate.data('datepicker').setDate(endDate);
        this.endTime.timepicker('setTime', date);
        this.priorTimeDelta = this.getTimeDelta();
    };

    /** Force end date time to be after start date time.
     */
    this.verifyStartEnd = function () {
        var timeDelta;
        timeDelta = this.getTimeDelta();
        // Nothing to do if timeDelta is NaN.
        if (isNaN(timeDelta)) {
            return;
        }
        // Start must be before end.  If not then shift end.
        if (timeDelta <= 0) {
            timeDelta = this.oneHourMS / 1000;
            this.updateEndTime(timeDelta);
        }
        this.displayDuration(timeDelta * 1000);
    };

    /** Enables the datepairs and increases the opacity
     */
    this.enable = function () {
        // Enable date / time entry
        this.startDate.prop('disabled', false);
        this.endDate.prop('disabled', false);
        this.startTime.prop('disabled', false);
        this.endTime.prop('disabled', false);
        this.startDate.fadeTo('fast', 1.0);
        this.endDate.fadeTo('fast', 1.0);
        this.startTime.fadeTo('fast', 1.0);
        this.endTime.fadeTo('fast', 1.0);
    };

    /** Disables the datepairs and decreases the opacity
     */
    this.disable = function () {
        // Disable date / time entry
        this.startDate.prop('disabled', true);
        this.endDate.prop('disabled', true);
        this.startTime.prop('disabled', true);
        this.endTime.prop('disabled', true);
        this.startDate.fadeTo('fast', 0.5);
        this.endDate.fadeTo('fast', 0.5);
        this.startTime.fadeTo('fast', 0.5);
        this.endTime.fadeTo('fast', 0.5);
    };

    this.displayDuration = function (datetimeDelta) {
        var dateTimeDeltaMinutes = datetimeDelta/(this.oneHourMS/60),
            dateString,
            hourString,
            minuteString,
            dateInt,
            hourInt;

        dateInt = Math.floor(dateTimeDeltaMinutes / (60 * 24));
        dateString = dateInt + ' days';
        dateString = (dateString === '1 days') ? '1 day': dateString;
        dateString = (dateString === '0 days') ? '': dateString;
        dateTimeDeltaMinutes -= (dateInt * (60 * 24));

        hourInt = Math.floor(dateTimeDeltaMinutes / 60);
        hourString = hourInt + ' hours';
        hourString = (hourString === '1 hours') ? '1 hour': hourString;
        hourString = (hourString === '0 hours') ? '': hourString;
        dateTimeDeltaMinutes -= (hourInt * 60);

        minuteString = dateTimeDeltaMinutes + ' mins';
        minuteString = (minuteString === '1 min') ? '1 min': minuteString;
        minuteString = (minuteString === '0 mins') ? '': minuteString;

        $('.output-duration').text(dateString + ' ' + hourString + ' ' + minuteString);
    };

    this.oneHourMS = 60 * 60 * 1000;  // one hour in ms

    // constructor
    return (function (thisDatePair) {
        thisDatePair.initialize(shouldSetToNow, hoursToAdd);
        return thisDatePair;
    }(this));
};

DatePair.datePickerOptions = {
    'autoclose': true,
    'todayHighlight': true,
    'startDate': new Date(),
};

DatePair.timePickerOptions = {
    'timeFormat': 'g:ia',
    'scrollDefaultNow': true
};
;
/************************
jquery-timepicker v1.1.10
http://jonthornton.github.com/jquery-timepicker/

requires jQuery 1.7+
************************/


(function (factory) {
	if (typeof define === 'function' && define.amd) {
		// AMD. Register as an anonymous module.
		define(['jquery'], factory);
	} else {
		// Browser globals
		factory(jQuery);
	}
}(function ($) {
	var _baseDate = _generateBaseDate();
	var _ONE_DAY = 86400;
	var _defaults =	{
		className: null,
		minTime: null,
		maxTime: null,
		durationTime: null,
		step: 30,
		showDuration: false,
		timeFormat: 'g:ia',
		scrollDefaultNow: false,
		scrollDefaultTime: false,
		selectOnBlur: false,
		disableTouchKeyboard: true,
		forceRoundTime: false,
		appendTo: 'body',
		disableTimeRanges: [],
		closeOnWindowScroll: false,
		disableTextInput: false
	};
	var _lang = {
		decimal: '.',
		mins: 'mins',
		hr: 'hr',
		hrs: 'hrs'
	};

	var methods =
	{
		init: function(options)
		{
			return this.each(function()
			{
				var self = $(this);

				// convert dropdowns to text input
				if (self[0].tagName == 'SELECT') {
					var attrs = { 'type': 'text', 'value': self.val() };
					var raw_attrs = self[0].attributes;

					for (var i=0; i < raw_attrs.length; i++) {
						attrs[raw_attrs[i].nodeName] = raw_attrs[i].nodeValue;
					}

					var input = $('<input />', attrs);
					self.replaceWith(input);
					self = input;
				}

				var settings = $.extend({}, _defaults);

				if (options) {
					settings = $.extend(settings, options);
				}

				if (settings.lang) {
					_lang = $.extend(_lang, settings.lang);
				}

				settings = _parseSettings(settings);

				self.data('timepicker-settings', settings);
				self.prop('autocomplete', 'off');
				self.on('click.timepicker focus.timepicker', methods.show);
				self.on('blur.timepicker', _formatValue);
				self.on('keydown.timepicker', _keydownhandler);
				self.on('keyup.timepicker', _keyuphandler);
				self.addClass('ui-timepicker-input');

				_formatValue.call(self.get(0));
			});
		},

		show: function(e)
		{
			var self = $(this);
			var settings = self.data('timepicker-settings');

			if ('ontouchstart' in document && settings.disableTouchKeyboard) {
				// block the keyboard on mobile devices
				self.blur();
			}

			var list = self.data('timepicker-list');

			// check if input is readonly
			if (self.prop('readonly')) {
				return;
			}

			// check if list needs to be rendered
			if (!list || list.length === 0 || typeof settings.durationTime === 'function') {
				_render(self);
				list = self.data('timepicker-list');
			}

			if (list.is(':visible')) {
				return;
			}

			// make sure other pickers are hidden
			methods.hide();

			list.show();

            // Fixes bug in IE8 where offset evaluates to NaN
            if (list.css('margin-top') === 'auto') {
 				list.offset({
					'left': self.offset().left,
					'top': self.offset().top
				});

            } else if ((self.offset().top + self.outerHeight(true) + list.outerHeight()) > $(window).height() + $(window).scrollTop()) {
				// position the dropdown on top
				list.offset({
					'left': self.offset().left + parseInt(list.css('marginLeft').replace('px', ''), 10),
					'top': self.offset().top - list.outerHeight() + parseInt(list.css('marginTop').replace('px', ''), 10)
				});
			} else {
				// put it under the input
				list.offset({
					'left':self.offset().left + parseInt(list.css('marginLeft').replace('px', ''), 10),
					'top': self.offset().top + self.outerHeight() + parseInt(list.css('marginTop').replace('px', ''), 10)
				});
			}

			// position scrolling
			var selected = list.find('.ui-timepicker-selected');

			if (!selected.length) {
				if (_getTimeValue(self)) {
					selected = _findRow(self, list, _time2int(_getTimeValue(self)));
				} else if (settings.scrollDefaultNow) {
					selected = _findRow(self, list, _time2int(new Date()));
				} else if (settings.scrollDefaultTime !== false) {
					selected = _findRow(self, list, _time2int(settings.scrollDefaultTime));
				}
			}

			if (selected && selected.length) {
				var topOffset = list.scrollTop() + selected.position().top - selected.outerHeight();
				list.scrollTop(topOffset);
			} else {
				list.scrollTop(0);
			}

			_attachCloseHandler(settings);

			self.trigger('showTimepicker');
		},

		hide: function(e)
		{
			$('.ui-timepicker-wrapper:visible').each(function() {
				var list = $(this);
				var self = list.data('timepicker-input');
				var settings = self.data('timepicker-settings');

				if (settings && settings.selectOnBlur) {
					_selectValue(self);
				}

				list.hide();
				self.trigger('hideTimepicker');
			});
		},

		option: function(key, value)
		{
			var self = this;
			var settings = self.data('timepicker-settings');
			var list = self.data('timepicker-list');

			if (typeof key == 'object') {
				settings = $.extend(settings, key);

			} else if (typeof key == 'string' && typeof value != 'undefined') {
				settings[key] = value;

			} else if (typeof key == 'string') {
				return settings[key];
			}

			settings = _parseSettings(settings);

			self.data('timepicker-settings', settings);

			if (list) {
				list.remove();
				self.data('timepicker-list', false);
			}

			return self;
		},

		getSecondsFromMidnight: function()
		{
			return _time2int(_getTimeValue(this));
		},

		getTime: function()
		{
			var self = this;
			var today = new Date();
			today.setHours(0, 0, 0, 0);
			return new Date(today.valueOf() + (_time2int(_getTimeValue(self))*1000));
		},

		setTime: function(value)
		{
			var self = this;
			var prettyTime = _int2time(_time2int(value), self.data('timepicker-settings').timeFormat);
			_setTimeValue(self, prettyTime);
		},

		remove: function()
		{
			var self = this;

			// check if this element is a timepicker
			if (!self.hasClass('ui-timepicker-input')) {
				return;
			}

			self.removeAttr('autocomplete', 'off');
			self.removeClass('ui-timepicker-input');
			self.removeData('timepicker-settings');
			self.off('.timepicker');

			// timepicker-list won't be present unless the user has interacted with this timepicker
			if (self.data('timepicker-list')) {
				self.data('timepicker-list').remove();
			}

			self.removeData('timepicker-list');
		}
	};

	// private methods

	function _parseSettings(settings)
	{
		if (settings.minTime) {
			settings.minTime = _time2int(settings.minTime);
		}

		if (settings.maxTime) {
			settings.maxTime = _time2int(settings.maxTime);
		}

		if (settings.durationTime && typeof settings.durationTime !== 'function') {
			settings.durationTime = _time2int(settings.durationTime);
		}

		if (settings.disableTimeRanges.length > 0) {
			// convert string times to integers
			for (var i in settings.disableTimeRanges) {
				settings.disableTimeRanges[i] = [
					_time2int(settings.disableTimeRanges[i][0]),
					_time2int(settings.disableTimeRanges[i][1])
				];
			}

			// sort by starting time
			settings.disableTimeRanges = settings.disableTimeRanges.sort(function(a, b){
				return a[0] - b[0];
			});
		}

		return settings;
	}

	function _render(self)
	{
		var settings = self.data('timepicker-settings');
		var list = self.data('timepicker-list');

		if (list && list.length) {
			list.remove();
			self.data('timepicker-list', false);
		}

		list = $('<ul />', { 'class': 'ui-timepicker-list' });

		var wrapped_list = $('<div />', { 'class': 'ui-timepicker-wrapper', 'tabindex': -1 });
		wrapped_list.css({'display':'none', 'position': 'absolute' }).append(list);


		if (settings.className) {
			wrapped_list.addClass(settings.className);
		}

		if ((settings.minTime !== null || settings.durationTime !== null) && settings.showDuration) {
			wrapped_list.addClass('ui-timepicker-with-duration');
		}

		var durStart = settings.minTime;
		if (typeof settings.durationTime === 'function') {
			durStart = _time2int(settings.durationTime());
		} else if (settings.durationTime !== null) {
			durStart = settings.durationTime;
		}
		var start = (settings.minTime !== null) ? settings.minTime : 0;
		var end = (settings.maxTime !== null) ? settings.maxTime : (start + _ONE_DAY - 1);

		if (end <= start) {
			// make sure the end time is greater than start time, otherwise there will be no list to show
			end += _ONE_DAY;
		}

		var dr = settings.disableTimeRanges;
		var drCur = 0;
		var drLen = dr.length;

		for (var i=start; i <= end; i += settings.step*60) {
			var timeInt = i%_ONE_DAY;

			var row = $('<li />');
			row.data('time', timeInt);
			row.text(_int2time(timeInt, settings.timeFormat));

			if ((settings.minTime !== null || settings.durationTime !== null) && settings.showDuration) {
				var duration = $('<span />');
				duration.addClass('ui-timepicker-duration');
				duration.text(' ('+_int2duration(i - durStart)+')');
				row.append(duration);
			}

			if (drCur < drLen) {
				if (timeInt >= dr[drCur][0] && timeInt < dr[drCur][1]) {
					row.addClass('ui-timepicker-disabled');
				} else if (timeInt >= dr[drCur][1]) {
					drCur += 1;
				}
			}

			list.append(row);
		}

		wrapped_list.data('timepicker-input', self);
		self.data('timepicker-list', wrapped_list);

		var appendTo = settings.appendTo;
		if (typeof appendTo === 'string') {
			appendTo = $(appendTo);
		} else if (typeof appendTo === 'function') {
			appendTo = appendTo(self);
		}
		appendTo.append(wrapped_list);
		_setSelected(self, list);

		list.on('click', 'li', function(e) {

			// hack: temporarily disable the focus handler
			// to deal with the fact that IE fires 'focus'
			// events asynchronously
			self.off('focus.timepicker');
			self.on('focus.timepicker-ie-hack', function(){
				self.off('focus.timepicker-ie-hack');
				self.on('focus.timepicker', methods.show);
			});
			self[0].focus();

			// make sure only the clicked row is selected
			list.find('li').removeClass('ui-timepicker-selected');
			$(this).addClass('ui-timepicker-selected');

			if (_selectValue(self)) {
				wrapped_list.hide();
			}
		});
	}

	function _generateBaseDate()
	{
		return new Date(1970, 1, 1, 0, 0, 0);
	}

	function _attachCloseHandler(settings)
	{
		if ('ontouchstart' in document) {
			$('body').on('touchstart.ui-timepicker', _closeHandler);
		} else {
			$('body').on('mousedown.ui-timepicker', _closeHandler);
			if (settings.closeOnWindowScroll) {
				$(window).on('scroll.ui-timepicker', _closeHandler);
			}
		}
	}

	// event handler to decide whether to close timepicker
	function _closeHandler(e)
	{
		var target = $(e.target);
		var input = target.closest('.ui-timepicker-input');
		if (input.length === 0 && target.closest('.ui-timepicker-wrapper').length === 0) {
			methods.hide();
			$('body').unbind('.ui-timepicker');
			$(window).unbind('.ui-timepicker');
		}
	}

	function _findRow(self, list, value)
	{
		if (!value && value !== 0) {
			return false;
		}

		var settings = self.data('timepicker-settings');
		var out = false;
		var halfStep = settings.step*30;

		// loop through the menu items
		list.find('li').each(function(i, obj) {
			var jObj = $(obj);

			var offset = jObj.data('time') - value;

			// check if the value is less than half a step from each row
			if (Math.abs(offset) < halfStep || offset == halfStep) {
				out = jObj;
				return false;
			}
		});

		return out;
	}

	function _setSelected(self, list)
	{
		list.find('li').removeClass('ui-timepicker-selected');

		var timeValue = _time2int(_getTimeValue(self));
		if (!timeValue) {
			return;
		}

		var selected = _findRow(self, list, timeValue);
		if (selected) {

			var topDelta = selected.offset().top - list.offset().top;

			if (topDelta + selected.outerHeight() > list.outerHeight() || topDelta < 0) {
				list.scrollTop(list.scrollTop() + selected.position().top - selected.outerHeight());
			}

			selected.addClass('ui-timepicker-selected');
		}
	}


	function _formatValue()
	{
		if (this.value === '') {
			return;
		}

		var self = $(this);
		var seconds = _time2int(this.value);

		if (seconds === null) {
			self.trigger('timeFormatError');
			return;
		}

		var settings = self.data('timepicker-settings');

		// check that the time in within bounds
		if (settings.minTime !== null && seconds < settings.minTime) {
			self.trigger('timeRangeError');
		} else if (settings.maxTime !== null && seconds > settings.maxTime) {
			self.trigger('timeRangeError');
		}

		// check that time isn't within disabled time ranges
		$.each(settings.disableTimeRanges, function(){
			if (seconds >= this[0] && seconds < this[1]) {
				self.trigger('timeRangeError');
				return false;
			}
		});

		if (settings.forceRoundTime) {
			var offset = seconds % (settings.step*60); // step is in minutes

			if (offset >= settings.step*30) {
				// if offset is larger than a half step, round up
				seconds += (settings.step*60) - offset;
			} else {
				// round down
				seconds -= offset;
			}
		}

		var prettyTime = _int2time(seconds, settings.timeFormat);
		_setTimeValue(self, prettyTime);
	}

	function _getTimeValue(self)
	{
		if (self.is('input')) {
			return self.val();
		} else {
			// use the element's data attributes to store values
			return self.data('ui-timepicker-value');
		}
	}

	function _setTimeValue(self, value)
	{
		if (self.is('input')) {
			self.val(value);
		} else {
			// use the element's data attributes to store values
			self.data('ui-timepicker-value', value);
		}
	}

	/*
	*  Keyboard navigation via arrow keys
	*/
	function _keydownhandler(e)
	{
		var self = $(this);
		var list = self.data('timepicker-list');

		if (!list || !list.is(':visible')) {
			if (e.keyCode == 40) {
				self.focus();
			} else {
				return _screenInput(e, self);
			}
		}

		switch (e.keyCode) {

			case 13: // return
				if (_selectValue(self)) {
					methods.hide.apply(this);
				}

				e.preventDefault();
				return false;

			case 38: // up
				var selected = list.find('.ui-timepicker-selected');

				if (!selected.length) {
					list.find('li').each(function(i, obj) {
						if ($(obj).position().top > 0) {
							selected = $(obj);
							return false;
						}
					});
					selected.addClass('ui-timepicker-selected');

				} else if (!selected.is(':first-child')) {
					selected.removeClass('ui-timepicker-selected');
					selected.prev().addClass('ui-timepicker-selected');

					if (selected.prev().position().top < selected.outerHeight()) {
						list.scrollTop(list.scrollTop() - selected.outerHeight());
					}
				}

				return false;

			case 40: // down
				selected = list.find('.ui-timepicker-selected');

				if (selected.length === 0) {
					list.find('li').each(function(i, obj) {
						if ($(obj).position().top > 0) {
							selected = $(obj);
							return false;
						}
					});

					selected.addClass('ui-timepicker-selected');
				} else if (!selected.is(':last-child')) {
					selected.removeClass('ui-timepicker-selected');
					selected.next().addClass('ui-timepicker-selected');

					if (selected.next().position().top + 2*selected.outerHeight() > list.outerHeight()) {
						list.scrollTop(list.scrollTop() + selected.outerHeight());
					}
				}

				return false;

			case 27: // escape
				list.find('li').removeClass('ui-timepicker-selected');
				list.hide();
				break;

			case 9: //tab
				methods.hide();
				break;

			default:
				return _screenInput(e, self);
		}
	}

	function _screenInput(e, self)
	{
		return !self.data('timepicker-settings').disableTextInput || e.ctrlKey || e.altKey || e.metaKey || (e.keyCode != 2 && (e.keyCode < 46 || e.keyCode > 90));
	}

	/*
	*	Time typeahead
	*/
	function _keyuphandler(e)
	{
		var self = $(this);
		var list = self.data('timepicker-list');

		if (!list || !list.is(':visible')) {
			return true;
		}

		switch (e.keyCode) {

			case 96: // numpad numerals
			case 97:
			case 98:
			case 99:
			case 100:
			case 101:
			case 102:
			case 103:
			case 104:
			case 105:
			case 48: // numerals
			case 49:
			case 50:
			case 51:
			case 52:
			case 53:
			case 54:
			case 55:
			case 56:
			case 57:
			case 65: // a
			case 77: // m
			case 80: // p
			case 186: // colon
			case 8: // backspace
			case 46: // delete
				_setSelected(self, list);
				break;

			default:
				// list.find('li').removeClass('ui-timepicker-selected');
				return;
		}
	}

	function _selectValue(self)
	{
		var settings = self.data('timepicker-settings');
		var list = self.data('timepicker-list');
		var timeValue = null;

		var cursor = list.find('.ui-timepicker-selected');

		if (cursor.hasClass('ui-timepicker-disabled')) {
			return false;
		}

		if (cursor.length) {
			// selected value found
			timeValue = cursor.data('time');

		} else if (_getTimeValue(self)) {

			// no selected value; fall back on input value
			timeValue = _time2int(_getTimeValue(self));

			_setSelected(self, list);
		}

		if (timeValue !== null) {
			var timeString = _int2time(timeValue, settings.timeFormat);
			_setTimeValue(self, timeString);
		}

		self.trigger('change').trigger('changeTime');
		return true;
	}

	function _int2duration(seconds)
	{
		var minutes = Math.round(seconds/60);
		var duration;

		if (Math.abs(minutes) < 60) {
			duration = [minutes, _lang.mins];
		} else if (minutes == 60) {
			duration = ['1', _lang.hr];
		} else {
			var hours = (minutes/60).toFixed(1);
			if (_lang.decimal != '.') hours = hours.replace('.', _lang.decimal);
			duration = [hours, _lang.hrs];
		}

		return duration.join(' ');
	}

	function _int2time(seconds, format)
	{
		if (seconds === null) {
			return;
		}

		var time = new Date(_baseDate.valueOf() + (seconds*1000));
		var output = '';
		var hour, code;

		for (var i=0; i<format.length; i++) {

			code = format.charAt(i);
			switch (code) {

				case 'a':
					output += (time.getHours() > 11) ? 'pm' : 'am';
					break;

				case 'A':
					output += (time.getHours() > 11) ? 'PM' : 'AM';
					break;

				case 'g':
					hour = time.getHours() % 12;
					output += (hour === 0) ? '12' : hour;
					break;

				case 'G':
					output += time.getHours();
					break;

				case 'h':
					hour = time.getHours() % 12;

					if (hour !== 0 && hour < 10) {
						hour = '0'+hour;
					}

					output += (hour === 0) ? '12' : hour;
					break;

				case 'H':
					hour = time.getHours();
					output += (hour > 9) ? hour : '0'+hour;
					break;

				case 'i':
					var minutes = time.getMinutes();
					output += (minutes > 9) ? minutes : '0'+minutes;
					break;

				case 's':
					seconds = time.getSeconds();
					output += (seconds > 9) ? seconds : '0'+seconds;
					break;

				default:
					output += code;
			}
		}

		return output;
	}

	function _time2int(timeString)
	{
		if (timeString === '') return null;
		if (!timeString || timeString+0 == timeString) return timeString;

		if (typeof(timeString) == 'object') {
			timeString = timeString.getHours()+':'+_pad2(timeString.getMinutes())+':'+_pad2(timeString.getSeconds());
		}

		timeString = timeString.toLowerCase();

		var d = new Date(0);
		var time;

		// try to parse time input
		if (timeString.indexOf(":") === -1) {
			// no colon present
			time = timeString.match(/^([0-9]):?([0-5][0-9])?:?([0-5][0-9])?\s*([pa]?)m?$/);

			if (!time) {
				time = timeString.match(/^([0-2][0-9]):?([0-5][0-9])?:?([0-5][0-9])?\s*([pa]?)m?$/);
			}
		} else {
			time = timeString.match(/^(\d{1,2})(?::([0-5][0-9]))?(?::([0-5][0-9]))?\s*([pa]?)m?$/);
		}

		if (!time) {
			return null;
		}

		var hour = parseInt(time[1]*1, 10);
		var hours;

		if (time[4]) {
			if (hour == 12) {
				hours = (time[4] == 'p') ? 12 : 0;
			} else {
				hours = (hour + (time[4] == 'p' ? 12 : 0));
			}

		} else {
			hours = hour;
		}

		var minutes = ( time[2]*1 || 0 );
		var seconds = ( time[3]*1 || 0 );
		return hours*3600 + minutes*60 + seconds;
	}

	function _pad2(n) {
		return ("0" + n).slice(-2);
	}

	// Plugin entry
	$.fn.timepicker = function(method)
	{
		if(methods[method]) { return methods[method].apply(this, Array.prototype.slice.call(arguments, 1)); }
		else if(typeof method === "object" || !method) { return methods.init.apply(this, arguments); }
		else { $.error("Method "+ method + " does not exist on jQuery.timepicker"); }
	};
}));
;
/* =========================================================
 * bootstrap-datepicker.js
 * Repo: https://github.com/eternicode/bootstrap-datepicker/
 * Demo: http://eternicode.github.io/bootstrap-datepicker/
 * Docs: http://bootstrap-datepicker.readthedocs.org/
 * Forked from http://www.eyecon.ro/bootstrap-datepicker
 * =========================================================
 * Started by Stefan Petre; improvements by Andrew Rowls + contributors
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * ========================================================= */

(function($, undefined) {

	var $window = $(window);

	function UTCDate(){
		return new Date(Date.UTC.apply(Date, arguments));
	}
	function UTCToday(){
		var today = new Date();
		return UTCDate(today.getFullYear(), today.getMonth(), today.getDate());
	}


	// Picker object

	var Datepicker = function(element, options) {
		this.date = undefined;
		this.viewDate = UTCToday();

		this._process_options(options);

		this.element = $(element);
		this.isInline = false;
		this.isInput = this.element.is('input');
		this.component = this.element.is('.date') ? this.element.find('.add-on, .btn') : false;
		this.hasInput = this.component && this.element.find('input').length;
		if(this.component && this.component.length === 0)
			this.component = false;

		this.picker = $(DPGlobal.template);
		this._buildEvents();
		this._attachEvents();

		if(this.isInline) {
			this.picker.addClass('datepicker-inline').appendTo(this.element);
		} else {
			this.picker.addClass('datepicker-dropdown dropdown-menu');
		}

		if (this.o.rtl){
			this.picker.addClass('datepicker-rtl');
			this.picker.find('.prev i, .next i')
						.toggleClass('icon-arrow-left icon-arrow-right');
		}

		this.viewMode = this.o.startView;

		if (this.o.calendarWeeks)
			this.picker.find('tfoot th.today')
						.attr('colspan', function(i, val){
							return parseInt(val) + 1;
						});

		this._allow_update = false;

		this.setStartDate(this._o.startDate);
		this.setEndDate(this._o.endDate);
		this.setDaysOfWeekDisabled(this.o.daysOfWeekDisabled);

		this.fillDow();
		this.fillMonths();

		this._allow_update = true;

		this.update();
		this.showMode();

		if(this.isInline) {
			this.show();
		}
	};

	Datepicker.prototype = {
		constructor: Datepicker,

		_process_options: function(opts){
			// Store raw options for reference
			this._o = $.extend({}, this._o, opts);
			// Processed options
			var o = this.o = $.extend({}, this._o);

			// Check if "de-DE" style date is available, if not language should
			// fallback to 2 letter code eg "de"
			var lang = o.language;
			if (!dates[lang]) {
				lang = lang.split('-')[0];
				if (!dates[lang])
					lang = defaults.language;
			}
			o.language = lang;

			switch(o.startView){
				case 2:
				case 'decade':
					o.startView = 2;
					break;
				case 1:
				case 'year':
					o.startView = 1;
					break;
				default:
					o.startView = 0;
			}

			switch (o.minViewMode) {
				case 1:
				case 'months':
					o.minViewMode = 1;
					break;
				case 2:
				case 'years':
					o.minViewMode = 2;
					break;
				default:
					o.minViewMode = 0;
			}

			o.startView = Math.max(o.startView, o.minViewMode);

			o.weekStart %= 7;
			o.weekEnd = ((o.weekStart + 6) % 7);

			var format = DPGlobal.parseFormat(o.format);
			if (o.startDate !== -Infinity) {
				if (!!o.startDate) {
					if (o.startDate instanceof Date)
						o.startDate = this._local_to_utc(this._zero_time(o.startDate));
					else
						o.startDate = DPGlobal.parseDate(o.startDate, format, o.language);
				} else {
					o.startDate = -Infinity;
				}
			}
			if (o.endDate !== Infinity) {
				if (!!o.endDate) {
					if (o.endDate instanceof Date)
						o.endDate = this._local_to_utc(this._zero_time(o.endDate));
					else
						o.endDate = DPGlobal.parseDate(o.endDate, format, o.language);
				} else {
					o.endDate = Infinity;
				}
			}

			o.daysOfWeekDisabled = o.daysOfWeekDisabled||[];
			if (!$.isArray(o.daysOfWeekDisabled))
				o.daysOfWeekDisabled = o.daysOfWeekDisabled.split(/[,\s]*/);
			o.daysOfWeekDisabled = $.map(o.daysOfWeekDisabled, function (d) {
				return parseInt(d, 10);
			});

			var plc = String(o.orientation).toLowerCase().split(/\s+/g),
				_plc = o.orientation.toLowerCase();
			plc = $.grep(plc, function(word){
				return (/^auto|left|right|top|bottom$/).test(word);
			});
			o.orientation = {x: 'auto', y: 'auto'};
			if (!_plc || _plc === 'auto')
				; // no action
			else if (plc.length === 1){
				switch(plc[0]){
					case 'top':
					case 'bottom':
						o.orientation.y = plc[0];
						break;
					case 'left':
					case 'right':
						o.orientation.x = plc[0];
						break;
				}
			}
			else {
				_plc = $.grep(plc, function(word){
					return (/^left|right$/).test(word);
				});
				o.orientation.x = _plc[0] || 'auto';

				_plc = $.grep(plc, function(word){
					return (/^top|bottom$/).test(word);
				});
				o.orientation.y = _plc[0] || 'auto';
			}
		},
		_events: [],
		_secondaryEvents: [],
		_applyEvents: function(evs){
			for (var i=0, el, ev; i<evs.length; i++){
				el = evs[i][0];
				ev = evs[i][1];
				el.on(ev);
			}
		},
		_unapplyEvents: function(evs){
			for (var i=0, el, ev; i<evs.length; i++){
				el = evs[i][0];
				ev = evs[i][1];
				el.off(ev);
			}
		},
		_buildEvents: function(){
			if (this.isInput) { // single input
				this._events = [
					[this.element, {
						click: $.proxy(this.show, this),
						focus: $.proxy(this.show, this),
						keyup: $.proxy(function(){ this.update() }, this),
						keydown: $.proxy(this.keydown, this)
					}]
				];
			}
			else if (this.component && this.hasInput){ // component: input + button
				this._events = [
					// For components that are not readonly, allow keyboard nav
					[this.element.find('input'), {
						click: $.proxy(this.show, this),
						focus: $.proxy(this.show, this),
						keyup: $.proxy(function(){ this.update() }, this),
						keydown: $.proxy(this.keydown, this)
					}],
					[this.component, {
						click: $.proxy(this.show, this)
					}]
				];
			}
			else if (this.element.is('div')) {  // inline datepicker
				this.isInline = true;
			}
			else {
				this._events = [
					[this.element, {
						click: $.proxy(this.show, this)
					}]
				];
			}

			this._secondaryEvents = [
				[this.picker, {
					click: $.proxy(this.click, this)
				}],
				[$(window), {
					resize: $.proxy(this.place, this)
				}],
				[$(document), {
					'mousedown touchstart': $.proxy(function (e) {
						// Clicked outside the datepicker, hide it
						if (!(
							this.element.is(e.target) ||
							this.element.find(e.target).length ||
							this.picker.is(e.target) ||
							this.picker.find(e.target).length
						)) {
							this.hide();
						}
					}, this)
				}]
			];
		},
		_attachEvents: function(){
			this._detachEvents();
			this._applyEvents(this._events);
		},
		_detachEvents: function(){
			this._unapplyEvents(this._events);
		},
		_attachSecondaryEvents: function(){
			this._detachSecondaryEvents();
			this._applyEvents(this._secondaryEvents);
		},
		_detachSecondaryEvents: function(){
			this._unapplyEvents(this._secondaryEvents);
		},
		_trigger: function(event, altdate){
			var date = altdate || this.date,
				local_date = this._utc_to_local(date);

			this.element.trigger({
				type: event,
				date: local_date,
				format: $.proxy(function(altformat){
					var format = altformat || this.o.format;
					return DPGlobal.formatDate(date, format, this.o.language);
				}, this)
			});
		},

		show: function(e) {
			if (!this.isInline)
				this.picker.appendTo('body');
			this.picker.show();
			this.height = this.component ? this.component.outerHeight() : this.element.outerHeight();
			this.place();
			this._attachSecondaryEvents();
			if (e) {
				e.preventDefault();
			}
			this._trigger('show');
		},

		hide: function(){
			if(this.isInline) return;
			if (!this.picker.is(':visible')) return;
			this.picker.hide().detach();
			this._detachSecondaryEvents();
			this.viewMode = this.o.startView;
			this.showMode();

			if (
				this.o.forceParse &&
				(
					this.isInput && this.element.val() ||
					this.hasInput && this.element.find('input').val()
				)
			)
				this.setValue();
			this._trigger('hide');
		},

		remove: function() {
			this.hide();
			this._detachEvents();
			this._detachSecondaryEvents();
			this.picker.remove();
			delete this.element.data().datepicker;
			if (!this.isInput) {
				delete this.element.data().date;
			}
		},

		_utc_to_local: function(utc){
			return utc && new Date(utc.getTime() + (utc.getTimezoneOffset()*60000));
		},
		_local_to_utc: function(local){
			return local && new Date(local.getTime() - (local.getTimezoneOffset()*60000));
		},
		_zero_time: function(local){
			return local && new Date(local.getFullYear(), local.getMonth(), local.getDate());
		},
		_zero_utc_time: function(utc){
			return utc && new Date(Date.UTC(utc.getUTCFullYear(), utc.getUTCMonth(), utc.getUTCDate()));
		},

		getDate: function() {
			return this._utc_to_local(this.getUTCDate());
		},

		getUTCDate: function() {
			return this.date;
		},

		setDate: function(d) {
			this.setUTCDate(this._local_to_utc(d));
		},

		setUTCDate: function(d) {
			this.date = d;
			this.setValue();
		},

		setValue: function() {
			var formatted = this.getFormattedDate();
			if (!this.isInput) {
				if (this.component){
					this.element.find('input').val(formatted).change();
				}
			} else {
				this.element.val(formatted); //.change();
			}
		},

		getFormattedDate: function(format) {
			if (format === undefined)
				format = this.o.format;
			return DPGlobal.formatDate(this.date, format, this.o.language);
		},

		setStartDate: function(startDate){
			this._process_options({startDate: startDate});
			this.update();
			this.updateNavArrows();
		},

		setEndDate: function(endDate){
			this._process_options({endDate: endDate});
			this.update();
			this.updateNavArrows();
		},

		setDaysOfWeekDisabled: function(daysOfWeekDisabled){
			this._process_options({daysOfWeekDisabled: daysOfWeekDisabled});
			this.update();
			this.updateNavArrows();
		},

		place: function(){
						if(this.isInline) return;
			var calendarWidth = this.picker.outerWidth(),
				calendarHeight = this.picker.outerHeight(),
				visualPadding = 10,
				windowWidth = $window.width(),
				windowHeight = $window.height(),
				scrollTop = $window.scrollTop();

			var zIndex = parseInt(this.element.parents().filter(function() {
							return $(this).css('z-index') != 'auto';
						}).first().css('z-index'))+10;
			var offset = this.component ? this.component.parent().offset() : this.element.offset();
			var height = this.component ? this.component.outerHeight(true) : this.element.outerHeight(false);
			var width = this.component ? this.component.outerWidth(true) : this.element.outerWidth(false);
			var left = offset.left,
				top = offset.top;

			this.picker.removeClass(
				'datepicker-orient-top datepicker-orient-bottom '+
				'datepicker-orient-right datepicker-orient-left'
			);

			if (this.o.orientation.x !== 'auto') {
				this.picker.addClass('datepicker-orient-' + this.o.orientation.x);
				if (this.o.orientation.x === 'right')
					left -= calendarWidth - width;
			}
			// auto x orientation is best-placement: if it crosses a window
			// edge, fudge it sideways
			else {
				// Default to left
				this.picker.addClass('datepicker-orient-left');
				if (offset.left < 0)
					left -= offset.left - visualPadding;
				else if (offset.left + calendarWidth > windowWidth)
					left = windowWidth - calendarWidth - visualPadding;
			}

			// auto y orientation is best-situation: top or bottom, no fudging,
			// decision based on which shows more of the calendar
			var yorient = this.o.orientation.y,
				top_overflow, bottom_overflow;
			if (yorient === 'auto') {
				top_overflow = -scrollTop + offset.top - calendarHeight;
				bottom_overflow = scrollTop + windowHeight - (offset.top + height + calendarHeight);
				if (Math.max(top_overflow, bottom_overflow) === bottom_overflow)
					yorient = 'top';
				else
					yorient = 'bottom';
			}
			this.picker.addClass('datepicker-orient-' + yorient);
			if (yorient === 'top')
				top += height;
			else
				top -= calendarHeight + parseInt(this.picker.css('padding-top'));

			this.picker.css({
				top: top,
				left: left,
				zIndex: zIndex
			});
		},

		_allow_update: true,
		update: function(){
			if (!this._allow_update) return;

			var oldDate = this.date && new Date(this.date),
				date, fromArgs = false;
			if(arguments.length) {
				date = arguments[0];
				if (date instanceof Date)
					date = this._local_to_utc(date);
				fromArgs = true;
			} else {
				date = this.isInput ? this.element.val() : this.element.data('date') || this.element.find('input').val();
				delete this.element.data().date;
			}

			this.date = DPGlobal.parseDate(date, this.o.format, this.o.language);

			if (this.date < this.o.startDate) {
				this.viewDate = new Date(this.o.startDate);
				this.date = new Date(this.o.startDate);
			} else if (this.date > this.o.endDate) {
				this.viewDate = new Date(this.o.endDate);
				this.date = new Date(this.o.endDate);
			} else if (this.date) {
				this.viewDate = new Date(this.date);
				this.date = new Date(this.date);
			} else {
				this.date = undefined;
			}

			if (fromArgs) {
				// setting date by clicking
				this.setValue();
			} else if (date) {
				// setting date by typing
				if (oldDate && this.date && oldDate.getTime() !== this.date.getTime())
					this._trigger('changeDate');
			}
			if (!this.date && oldDate)
				this._trigger('clearDate');

			this.fill();
		},

		fillDow: function(){
			var dowCnt = this.o.weekStart,
			html = '<tr>';
			if(this.o.calendarWeeks){
				var cell = '<th class="cw">&nbsp;</th>';
				html += cell;
				this.picker.find('.datepicker-days thead tr:first-child').prepend(cell);
			}
			while (dowCnt < this.o.weekStart + 7) {
				html += '<th class="dow">'+dates[this.o.language].daysMin[(dowCnt++)%7]+'</th>';
			}
			html += '</tr>';
			this.picker.find('.datepicker-days thead').append(html);
		},

		fillMonths: function(){
			var html = '',
			i = 0;
			while (i < 12) {
				html += '<span class="month">'+dates[this.o.language].monthsShort[i++]+'</span>';
			}
			this.picker.find('.datepicker-months td').html(html);
		},

		setRange: function(range){
			if (!range || !range.length)
				delete this.range;
			else
				this.range = $.map(range, function(d){ return d.valueOf(); });
			this.fill();
		},

		getClassNames: function(date){
			var cls = [],
				year = this.viewDate.getUTCFullYear(),
				month = this.viewDate.getUTCMonth(),
				currentDate = this.date && this.date.valueOf(),
				today = new Date();
			if (date.getUTCFullYear() < year || (date.getUTCFullYear() == year && date.getUTCMonth() < month)) {
				cls.push('old');
			} else if (date.getUTCFullYear() > year || (date.getUTCFullYear() == year && date.getUTCMonth() > month)) {
				cls.push('new');
			}
			// Compare internal UTC date with local today, not UTC today
			if (this.o.todayHighlight &&
				date.getUTCFullYear() == today.getFullYear() &&
				date.getUTCMonth() == today.getMonth() &&
				date.getUTCDate() == today.getDate()) {
				cls.push('today');
			}
			if (date.valueOf() == currentDate) {
				cls.push('active');
			}
			if (date.valueOf() < this.o.startDate || date.valueOf() > this.o.endDate ||
				$.inArray(date.getUTCDay(), this.o.daysOfWeekDisabled) !== -1) {
				cls.push('disabled');
			}
			if (this.range){
				if (date > this.range[0] && date < this.range[this.range.length-1]){
					cls.push('range');
				}
				if ($.inArray(date.valueOf(), this.range) != -1){
					cls.push('selected');
				}
			}
			return cls;
		},

		fill: function() {
			var d = new Date(this.viewDate),
				year = d.getUTCFullYear(),
				month = d.getUTCMonth(),
				startYear = this.o.startDate !== -Infinity ? this.o.startDate.getUTCFullYear() : -Infinity,
				startMonth = this.o.startDate !== -Infinity ? this.o.startDate.getUTCMonth() : -Infinity,
				endYear = this.o.endDate !== Infinity ? this.o.endDate.getUTCFullYear() : Infinity,
				endMonth = this.o.endDate !== Infinity ? this.o.endDate.getUTCMonth() : Infinity,
				tooltip;
			this.picker.find('.datepicker-days thead th.datepicker-switch')
						.text(dates[this.o.language].months[month]+' '+year);
			this.picker.find('tfoot th.today')
						.text(dates[this.o.language].today)
						.toggle(this.o.todayBtn !== false);
			this.picker.find('tfoot th.clear')
						.text(dates[this.o.language].clear)
						.toggle(this.o.clearBtn !== false);
			this.updateNavArrows();
			this.fillMonths();
			var prevMonth = UTCDate(year, month-1, 28),
				day = DPGlobal.getDaysInMonth(prevMonth.getUTCFullYear(), prevMonth.getUTCMonth());
			prevMonth.setUTCDate(day);
			prevMonth.setUTCDate(day - (prevMonth.getUTCDay() - this.o.weekStart + 7)%7);
			var nextMonth = new Date(prevMonth);
			nextMonth.setUTCDate(nextMonth.getUTCDate() + 42);
			nextMonth = nextMonth.valueOf();
			var html = [];
			var clsName;
			while(prevMonth.valueOf() < nextMonth) {
				if (prevMonth.getUTCDay() == this.o.weekStart) {
					html.push('<tr>');
					if(this.o.calendarWeeks){
						// ISO 8601: First week contains first thursday.
						// ISO also states week starts on Monday, but we can be more abstract here.
						var
							// Start of current week: based on weekstart/current date
							ws = new Date(+prevMonth + (this.o.weekStart - prevMonth.getUTCDay() - 7) % 7 * 864e5),
							// Thursday of this week
							th = new Date(+ws + (7 + 4 - ws.getUTCDay()) % 7 * 864e5),
							// First Thursday of year, year from thursday
							yth = new Date(+(yth = UTCDate(th.getUTCFullYear(), 0, 1)) + (7 + 4 - yth.getUTCDay())%7*864e5),
							// Calendar week: ms between thursdays, div ms per day, div 7 days
							calWeek =  (th - yth) / 864e5 / 7 + 1;
						html.push('<td class="cw">'+ calWeek +'</td>');

					}
				}
				clsName = this.getClassNames(prevMonth);
				clsName.push('day');

				if (this.o.beforeShowDay !== $.noop){
					var before = this.o.beforeShowDay(this._utc_to_local(prevMonth));
					if (before === undefined)
						before = {};
					else if (typeof(before) === 'boolean')
						before = {enabled: before};
					else if (typeof(before) === 'string')
						before = {classes: before};
					if (before.enabled === false)
						clsName.push('disabled');
					if (before.classes)
						clsName = clsName.concat(before.classes.split(/\s+/));
					if (before.tooltip)
						tooltip = before.tooltip;
				}

				clsName = $.unique(clsName);
				html.push('<td class="'+clsName.join(' ')+'"' + (tooltip ? ' title="'+tooltip+'"' : '') + '>'+prevMonth.getUTCDate() + '</td>');
				if (prevMonth.getUTCDay() == this.o.weekEnd) {
					html.push('</tr>');
				}
				prevMonth.setUTCDate(prevMonth.getUTCDate()+1);
			}
			this.picker.find('.datepicker-days tbody').empty().append(html.join(''));
			var currentYear = this.date && this.date.getUTCFullYear();

			var months = this.picker.find('.datepicker-months')
						.find('th:eq(1)')
							.text(year)
							.end()
						.find('span').removeClass('active');
			if (currentYear && currentYear == year) {
				months.eq(this.date && this.date.getUTCMonth()).addClass('active');
			}
			if (year < startYear || year > endYear) {
				months.addClass('disabled');
			}
			if (year == startYear) {
				months.slice(0, startMonth).addClass('disabled');
			}
			if (year == endYear) {
				months.slice(endMonth+1).addClass('disabled');
			}

			html = '';
			year = parseInt(year/10, 10) * 10;
			var yearCont = this.picker.find('.datepicker-years')
								.find('th:eq(1)')
									.text(year + '-' + (year + 9))
									.end()
								.find('td');
			year -= 1;
			for (var i = -1; i < 11; i++) {
				html += '<span class="year'+(i == -1 ? ' old' : i == 10 ? ' new' : '')+(currentYear == year ? ' active' : '')+(year < startYear || year > endYear ? ' disabled' : '')+'">'+year+'</span>';
				year += 1;
			}
			yearCont.html(html);
		},

		updateNavArrows: function() {
			if (!this._allow_update) return;

			var d = new Date(this.viewDate),
				year = d.getUTCFullYear(),
				month = d.getUTCMonth();
			switch (this.viewMode) {
				case 0:
					if (this.o.startDate !== -Infinity && year <= this.o.startDate.getUTCFullYear() && month <= this.o.startDate.getUTCMonth()) {
						this.picker.find('.prev').css({visibility: 'hidden'});
					} else {
						this.picker.find('.prev').css({visibility: 'visible'});
					}
					if (this.o.endDate !== Infinity && year >= this.o.endDate.getUTCFullYear() && month >= this.o.endDate.getUTCMonth()) {
						this.picker.find('.next').css({visibility: 'hidden'});
					} else {
						this.picker.find('.next').css({visibility: 'visible'});
					}
					break;
				case 1:
				case 2:
					if (this.o.startDate !== -Infinity && year <= this.o.startDate.getUTCFullYear()) {
						this.picker.find('.prev').css({visibility: 'hidden'});
					} else {
						this.picker.find('.prev').css({visibility: 'visible'});
					}
					if (this.o.endDate !== Infinity && year >= this.o.endDate.getUTCFullYear()) {
						this.picker.find('.next').css({visibility: 'hidden'});
					} else {
						this.picker.find('.next').css({visibility: 'visible'});
					}
					break;
			}
		},

		click: function(e) {
			e.preventDefault();
			var target = $(e.target).closest('span, td, th'),
				year, month, day;
			if (target.length == 1) {
				switch(target[0].nodeName.toLowerCase()) {
					case 'th':
						switch(target[0].className) {
							case 'datepicker-switch':
								this.showMode(1);
								break;
							case 'prev':
							case 'next':
								var dir = DPGlobal.modes[this.viewMode].navStep * (target[0].className == 'prev' ? -1 : 1);
								switch(this.viewMode){
									case 0:
										this.viewDate = this.moveMonth(this.viewDate, dir);
										this._trigger('changeMonth', this.viewDate);
										break;
									case 1:
									case 2:
										this.viewDate = this.moveYear(this.viewDate, dir);
										if (this.viewMode === 1)
											this._trigger('changeYear', this.viewDate);
										break;
								}
								this.fill();
								break;
							case 'today':
								var date = new Date();
								date = UTCDate(date.getFullYear(), date.getMonth(), date.getDate(), 0, 0, 0);

								this.showMode(-2);
								var which = this.o.todayBtn == 'linked' ? null : 'view';
								this._setDate(date, which);
								break;
							case 'clear':
								var element;
								if (this.isInput)
									element = this.element;
								else if (this.component)
									element = this.element.find('input');
								if (element)
									element.val("").change();
								this.update();
								this._trigger('changeDate');
								if (this.o.autoclose)
									this.hide();
								break;
						}
						break;
					case 'span':
						if (!target.is('.disabled')) {
							this.viewDate.setUTCDate(1);
							if (target.is('.month')) {
								day = 1;
								month = target.parent().find('span').index(target);
								year = this.viewDate.getUTCFullYear();
								this.viewDate.setUTCMonth(month);
								this._trigger('changeMonth', this.viewDate);
								if (this.o.minViewMode === 1) {
									this._setDate(UTCDate(year, month, day));
								}
							} else {
								day = 1;
								month = 0;
								year = parseInt(target.text(), 10)||0;
								this.viewDate.setUTCFullYear(year);
								this._trigger('changeYear', this.viewDate);
								if (this.o.minViewMode === 2) {
									this._setDate(UTCDate(year, month, day));
								}
							}
							this.showMode(-1);
							this.fill();
						}
						break;
					case 'td':
						if (target.is('.day') && !target.is('.disabled')){
							day = parseInt(target.text(), 10)||1;
							year = this.viewDate.getUTCFullYear();
							month = this.viewDate.getUTCMonth();
							if (target.is('.old')) {
								if (month === 0) {
									month = 11;
									year -= 1;
								} else {
									month -= 1;
								}
							} else if (target.is('.new')) {
								if (month == 11) {
									month = 0;
									year += 1;
								} else {
									month += 1;
								}
							}
							this._setDate(UTCDate(year, month, day));
						}
						break;
				}
			}
		},

		_setDate: function(date, which){
			if (!which || which == 'date')
				this.date = date && new Date(date);
			if (!which || which  == 'view')
				this.viewDate = date && new Date(date);
			this.fill();
			this.setValue();
			this._trigger('changeDate');
			var element;
			if (this.isInput) {
				element = this.element;
			} else if (this.component){
				element = this.element.find('input');
			}
			if (element) {
				element.change();
			}
			if (this.o.autoclose && (!which || which == 'date')) {
				this.hide();
			}
		},

		moveMonth: function(date, dir){
			if (!date) return undefined;
			if (!dir) return date;
			var new_date = new Date(date.valueOf()),
				day = new_date.getUTCDate(),
				month = new_date.getUTCMonth(),
				mag = Math.abs(dir),
				new_month, test;
			dir = dir > 0 ? 1 : -1;
			if (mag == 1){
				test = dir == -1
					// If going back one month, make sure month is not current month
					// (eg, Mar 31 -> Feb 31 == Feb 28, not Mar 02)
					? function(){ return new_date.getUTCMonth() == month; }
					// If going forward one month, make sure month is as expected
					// (eg, Jan 31 -> Feb 31 == Feb 28, not Mar 02)
					: function(){ return new_date.getUTCMonth() != new_month; };
				new_month = month + dir;
				new_date.setUTCMonth(new_month);
				// Dec -> Jan (12) or Jan -> Dec (-1) -- limit expected date to 0-11
				if (new_month < 0 || new_month > 11)
					new_month = (new_month + 12) % 12;
			} else {
				// For magnitudes >1, move one month at a time...
				for (var i=0; i<mag; i++)
					// ...which might decrease the day (eg, Jan 31 to Feb 28, etc)...
					new_date = this.moveMonth(new_date, dir);
				// ...then reset the day, keeping it in the new month
				new_month = new_date.getUTCMonth();
				new_date.setUTCDate(day);
				test = function(){ return new_month != new_date.getUTCMonth(); };
			}
			// Common date-resetting loop -- if date is beyond end of month, make it
			// end of month
			while (test()){
				new_date.setUTCDate(--day);
				new_date.setUTCMonth(new_month);
			}
			return new_date;
		},

		moveYear: function(date, dir){
			return this.moveMonth(date, dir*12);
		},

		dateWithinRange: function(date){
			return date >= this.o.startDate && date <= this.o.endDate;
		},

		keydown: function(e){
			if (this.picker.is(':not(:visible)')){
				if (e.keyCode == 27) // allow escape to hide and re-show picker
					this.show();
				return;
			}
			var dateChanged = false,
				dir, newDate, newViewDate;
			switch(e.keyCode){
				case 27: // escape
					this.hide();
					e.preventDefault();
					break;
				case 37: // left
				case 39: // right
					if (!this.o.keyboardNavigation) break;
					dir = e.keyCode == 37 ? -1 : 1;
					if (e.ctrlKey){
						newDate = this.moveYear(this.date || UTCToday(), dir);
						newViewDate = this.moveYear(this.viewDate, dir);
						this._trigger('changeYear', this.viewDate);
					} else if (e.shiftKey){
						newDate = this.moveMonth(this.date || UTCToday(), dir);
						newViewDate = this.moveMonth(this.viewDate, dir);
						this._trigger('changeMonth', this.viewDate);
					} else {
						newDate = new Date(this.date || UTCToday());
						newDate.setUTCDate(newDate.getUTCDate() + dir);
						newViewDate = new Date(this.viewDate);
						newViewDate.setUTCDate(this.viewDate.getUTCDate() + dir);
					}
					if (this.dateWithinRange(newDate)){
						this.date = newDate;
						this.viewDate = newViewDate;
						this.setValue();
						this.update();
						e.preventDefault();
						dateChanged = true;
					}
					break;
				case 38: // up
				case 40: // down
					if (!this.o.keyboardNavigation) break;
					dir = e.keyCode == 38 ? -1 : 1;
					if (e.ctrlKey){
						newDate = this.moveYear(this.date || UTCToday(), dir);
						newViewDate = this.moveYear(this.viewDate, dir);
						this._trigger('changeYear', this.viewDate);
					} else if (e.shiftKey){
						newDate = this.moveMonth(this.date || UTCToday(), dir);
						newViewDate = this.moveMonth(this.viewDate, dir);
						this._trigger('changeMonth', this.viewDate);
					} else {
						newDate = new Date(this.date || UTCToday());
						newDate.setUTCDate(this.date.getUTCDate() + dir * 7);
						newViewDate = new Date(this.viewDate);
						newViewDate.setUTCDate(this.viewDate.getUTCDate() + dir * 7);
					}
					if (this.dateWithinRange(newDate)){
						this.date = newDate;
						this.viewDate = newViewDate;
						this.setValue();
						this.update();
						e.preventDefault();
						dateChanged = true;
					}
					break;
				case 13: // enter
					this.hide();
					e.preventDefault();
					break;
				case 9: // tab
					this.hide();
					break;
			}
			if (dateChanged){
				this._trigger('changeDate');
				var element;
				if (this.isInput) {
					element = this.element;
				} else if (this.component){
					element = this.element.find('input');
				}
				if (element) {
					element.change();
				}
			}
		},

		showMode: function(dir) {
			if (dir) {
				this.viewMode = Math.max(this.o.minViewMode, Math.min(2, this.viewMode + dir));
			}
			/*
				vitalets: fixing bug of very special conditions:
				jquery 1.7.1 + webkit + show inline datepicker in bootstrap popover.
				Method show() does not set display css correctly and datepicker is not shown.
				Changed to .css('display', 'block') solve the problem.
				See https://github.com/vitalets/x-editable/issues/37

				In jquery 1.7.2+ everything works fine.
			*/
			//this.picker.find('>div').hide().filter('.datepicker-'+DPGlobal.modes[this.viewMode].clsName).show();
			this.picker.find('>div').hide().filter('.datepicker-'+DPGlobal.modes[this.viewMode].clsName).css('display', 'block');
			this.updateNavArrows();
		}
	};

	var DateRangePicker = function(element, options){
		this.element = $(element);
		this.inputs = $.map(options.inputs, function(i){ return i.jquery ? i[0] : i; });
		delete options.inputs;

		$(this.inputs)
			.datepicker(options)
			.bind('changeDate', $.proxy(this.dateUpdated, this));

		this.pickers = $.map(this.inputs, function(i){ return $(i).data('datepicker'); });
		this.updateDates();
	};
	DateRangePicker.prototype = {
		updateDates: function(){
			this.dates = $.map(this.pickers, function(i){ return i.date; });
			this.updateRanges();
		},
		updateRanges: function(){
			var range = $.map(this.dates, function(d){ return d.valueOf(); });
			$.each(this.pickers, function(i, p){
				p.setRange(range);
			});
		},
		dateUpdated: function(e){
			var dp = $(e.target).data('datepicker'),
				new_date = dp.getUTCDate(),
				i = $.inArray(e.target, this.inputs),
				l = this.inputs.length;
			if (i == -1) return;

			if (new_date < this.dates[i]){
				// Date being moved earlier/left
				while (i>=0 && new_date < this.dates[i]){
					this.pickers[i--].setUTCDate(new_date);
				}
			}
			else if (new_date > this.dates[i]){
				// Date being moved later/right
				while (i<l && new_date > this.dates[i]){
					this.pickers[i++].setUTCDate(new_date);
				}
			}
			this.updateDates();
		},
		remove: function(){
			$.map(this.pickers, function(p){ p.remove(); });
			delete this.element.data().datepicker;
		}
	};

	function opts_from_el(el, prefix){
		// Derive options from element data-attrs
		var data = $(el).data(),
			out = {}, inkey,
			replace = new RegExp('^' + prefix.toLowerCase() + '([A-Z])'),
			prefix = new RegExp('^' + prefix.toLowerCase());
		for (var key in data)
			if (prefix.test(key)){
				inkey = key.replace(replace, function(_,a){ return a.toLowerCase(); });
				out[inkey] = data[key];
			}
		return out;
	}

	function opts_from_locale(lang){
		// Derive options from locale plugins
		var out = {};
		// Check if "de-DE" style date is available, if not language should
		// fallback to 2 letter code eg "de"
		if (!dates[lang]) {
			lang = lang.split('-')[0];
			if (!dates[lang])
				return;
		}
		var d = dates[lang];
		$.each(locale_opts, function(i,k){
			if (k in d)
				out[k] = d[k];
		});
		return out;
	}

	var old = $.fn.datepicker;
	$.fn.datepicker = function ( option ) {
		var args = Array.apply(null, arguments);
		args.shift();
		var internal_return;
		this.each(function () {
			var $this = $(this),
				data = $this.data('datepicker'),
				options = typeof option == 'object' && option;
			if (!data) {
				var elopts = opts_from_el(this, 'date'),
					// Preliminary otions
					xopts = $.extend({}, defaults, elopts, options),
					locopts = opts_from_locale(xopts.language),
					// Options priority: js args, data-attrs, locales, defaults
					opts = $.extend({}, defaults, locopts, elopts, options);
				if ($this.is('.input-daterange') || opts.inputs){
					var ropts = {
						inputs: opts.inputs || $this.find('input').toArray()
					};
					$this.data('datepicker', (data = new DateRangePicker(this, $.extend(opts, ropts))));
				}
				else{
					$this.data('datepicker', (data = new Datepicker(this, opts)));
				}
			}
			if (typeof option == 'string' && typeof data[option] == 'function') {
				internal_return = data[option].apply(data, args);
				if (internal_return !== undefined)
					return false;
			}
		});
		if (internal_return !== undefined)
			return internal_return;
		else
			return this;
	};

	var defaults = $.fn.datepicker.defaults = {
		autoclose: false,
		beforeShowDay: $.noop,
		calendarWeeks: false,
		clearBtn: false,
		daysOfWeekDisabled: [],
		endDate: Infinity,
		forceParse: true,
		format: 'mm/dd/yyyy',
		keyboardNavigation: true,
		language: 'en',
		minViewMode: 0,
		orientation: "auto",
		rtl: false,
		startDate: -Infinity,
		startView: 0,
		todayBtn: false,
		todayHighlight: false,
		weekStart: 0
	};
	var locale_opts = $.fn.datepicker.locale_opts = [
		'format',
		'rtl',
		'weekStart'
	];
	$.fn.datepicker.Constructor = Datepicker;
	var dates = $.fn.datepicker.dates = {
		en: {
			days: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
			daysShort: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
			daysMin: ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"],
			months: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
			monthsShort: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
			today: "Today",
			clear: "Clear"
		}
	};

	var DPGlobal = {
		modes: [
			{
				clsName: 'days',
				navFnc: 'Month',
				navStep: 1
			},
			{
				clsName: 'months',
				navFnc: 'FullYear',
				navStep: 1
			},
			{
				clsName: 'years',
				navFnc: 'FullYear',
				navStep: 10
		}],
		isLeapYear: function (year) {
			return (((year % 4 === 0) && (year % 100 !== 0)) || (year % 400 === 0));
		},
		getDaysInMonth: function (year, month) {
			return [31, (DPGlobal.isLeapYear(year) ? 29 : 28), 31, 30, 31, 30, 31, 31, 30, 31, 30, 31][month];
		},
		validParts: /dd?|DD?|mm?|MM?|yy(?:yy)?/g,
		nonpunctuation: /[^ -\/:-@\[\u3400-\u9fff-`{-~\t\n\r]+/g,
		parseFormat: function(format){
			// IE treats \0 as a string end in inputs (truncating the value),
			// so it's a bad format delimiter, anyway
			var separators = format.replace(this.validParts, '\0').split('\0'),
				parts = format.match(this.validParts);
			if (!separators || !separators.length || !parts || parts.length === 0){
				throw new Error("Invalid date format.");
			}
			return {separators: separators, parts: parts};
		},
		parseDate: function(date, format, language) {
			if (!date)
				return undefined;
			if (date instanceof Date) return date;
			if (typeof format === 'string')
				format = DPGlobal.parseFormat(format);
			if (/^[\-+]\d+[dmwy]([\s,]+[\-+]\d+[dmwy])*$/.test(date)) {
				var part_re = /([\-+]\d+)([dmwy])/,
					parts = date.match(/([\-+]\d+)([dmwy])/g),
					part, dir;
				date = new Date();
				for (var i=0; i<parts.length; i++) {
					part = part_re.exec(parts[i]);
					dir = parseInt(part[1]);
					switch(part[2]){
						case 'd':
							date.setUTCDate(date.getUTCDate() + dir);
							break;
						case 'm':
							date = Datepicker.prototype.moveMonth.call(Datepicker.prototype, date, dir);
							break;
						case 'w':
							date.setUTCDate(date.getUTCDate() + dir * 7);
							break;
						case 'y':
							date = Datepicker.prototype.moveYear.call(Datepicker.prototype, date, dir);
							break;
					}
				}
				return UTCDate(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate(), 0, 0, 0);
			}
			var parts = date && date.match(this.nonpunctuation) || [],
				date = new Date(),
				parsed = {},
				setters_order = ['yyyy', 'yy', 'M', 'MM', 'm', 'mm', 'd', 'dd'],
				setters_map = {
					yyyy: function(d,v){ return d.setUTCFullYear(v); },
					yy: function(d,v){ return d.setUTCFullYear(2000+v); },
					m: function(d,v){
						if (isNaN(d))
							return d;
						v -= 1;
						while (v<0) v += 12;
						v %= 12;
						d.setUTCMonth(v);
						while (d.getUTCMonth() != v)
							d.setUTCDate(d.getUTCDate()-1);
						return d;
					},
					d: function(d,v){ return d.setUTCDate(v); }
				},
				val, filtered, part;
			setters_map['M'] = setters_map['MM'] = setters_map['mm'] = setters_map['m'];
			setters_map['dd'] = setters_map['d'];
			date = UTCDate(date.getFullYear(), date.getMonth(), date.getDate(), 0, 0, 0);
			var fparts = format.parts.slice();
			// Remove noop parts
			if (parts.length != fparts.length) {
				fparts = $(fparts).filter(function(i,p){
					return $.inArray(p, setters_order) !== -1;
				}).toArray();
			}
			// Process remainder
			if (parts.length == fparts.length) {
				for (var i=0, cnt = fparts.length; i < cnt; i++) {
					val = parseInt(parts[i], 10);
					part = fparts[i];
					if (isNaN(val)) {
						switch(part) {
							case 'MM':
								filtered = $(dates[language].months).filter(function(){
									var m = this.slice(0, parts[i].length),
										p = parts[i].slice(0, m.length);
									return m == p;
								});
								val = $.inArray(filtered[0], dates[language].months) + 1;
								break;
							case 'M':
								filtered = $(dates[language].monthsShort).filter(function(){
									var m = this.slice(0, parts[i].length),
										p = parts[i].slice(0, m.length);
									return m == p;
								});
								val = $.inArray(filtered[0], dates[language].monthsShort) + 1;
								break;
						}
					}
					parsed[part] = val;
				}
				for (var i=0, _date, s; i<setters_order.length; i++){
					s = setters_order[i];
					if (s in parsed && !isNaN(parsed[s])){
						_date = new Date(date);
						setters_map[s](_date, parsed[s]);
						if (!isNaN(_date))
							date = _date;
					}
				}
			}
			return date;
		},
		formatDate: function(date, format, language){
			if (!date)
				return '';
			if (typeof format === 'string')
				format = DPGlobal.parseFormat(format);
			var val = {
				d: date.getUTCDate(),
				D: dates[language].daysShort[date.getUTCDay()],
				DD: dates[language].days[date.getUTCDay()],
				m: date.getUTCMonth() + 1,
				M: dates[language].monthsShort[date.getUTCMonth()],
				MM: dates[language].months[date.getUTCMonth()],
				yy: date.getUTCFullYear().toString().substring(2),
				yyyy: date.getUTCFullYear()
			};
			val.dd = (val.d < 10 ? '0' : '') + val.d;
			val.mm = (val.m < 10 ? '0' : '') + val.m;
			var date = [],
				seps = $.extend([], format.separators);
			for (var i=0, cnt = format.parts.length; i <= cnt; i++) {
				if (seps.length)
					date.push(seps.shift());
				date.push(val[format.parts[i]]);
			}
			return date.join('');
		},
		headTemplate: '<thead>'+
							'<tr>'+
								'<th class="prev">&laquo;</th>'+
								'<th colspan="5" class="datepicker-switch"></th>'+
								'<th class="next">&raquo;</th>'+
							'</tr>'+
						'</thead>',
		contTemplate: '<tbody><tr><td colspan="7"></td></tr></tbody>',
		footTemplate: '<tfoot><tr><th colspan="7" class="today"></th></tr><tr><th colspan="7" class="clear"></th></tr></tfoot>'
	};
	DPGlobal.template = '<div class="datepicker">'+
							'<div class="datepicker-days">'+
								'<table class=" table-condensed">'+
									DPGlobal.headTemplate+
									'<tbody></tbody>'+
									DPGlobal.footTemplate+
								'</table>'+
							'</div>'+
							'<div class="datepicker-months">'+
								'<table class="table-condensed">'+
									DPGlobal.headTemplate+
									DPGlobal.contTemplate+
									DPGlobal.footTemplate+
								'</table>'+
							'</div>'+
							'<div class="datepicker-years">'+
								'<table class="table-condensed">'+
									DPGlobal.headTemplate+
									DPGlobal.contTemplate+
									DPGlobal.footTemplate+
								'</table>'+
							'</div>'+
						'</div>';

	$.fn.datepicker.DPGlobal = DPGlobal;


	/* DATEPICKER NO CONFLICT
	* =================== */

	$.fn.datepicker.noConflict = function(){
		$.fn.datepicker = old;
		return this;
	};


	/* DATEPICKER DATA-API
	* ================== */

	$(document).on(
		'focus.datepicker.data-api click.datepicker.data-api',
		'[data-provide="datepicker"]',
		function(e){
			var $this = $(this);
			if ($this.data('datepicker')) return;
			e.preventDefault();
			// component click requires us to explicitly show it
			$this.datepicker('show');
		}
	);
	$(function(){
		$('[data-provide="datepicker-inline"]').datepicker();
	});

}( window.jQuery ));
;
/*!
Chosen, a Select Box Enhancer for jQuery and Prototype
by Patrick Filler for Harvest, http://getharvest.com

Version 1.8.3
Full source at https://github.com/harvesthq/chosen
Copyright (c) 2011-2018 Harvest http://getharvest.com

MIT License, https://github.com/harvesthq/chosen/blob/master/LICENSE.md
This file is generated by `grunt build`, do not edit it by hand.
*/

(function() {
  var $, AbstractChosen, Chosen, SelectParser,
    bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  SelectParser = (function() {
    function SelectParser() {
      this.options_index = 0;
      this.parsed = [];
    }

    SelectParser.prototype.add_node = function(child) {
      if (child.nodeName.toUpperCase() === "OPTGROUP") {
        return this.add_group(child);
      } else {
        return this.add_option(child);
      }
    };

    SelectParser.prototype.add_group = function(group) {
      var group_position, i, len, option, ref, results1;
      group_position = this.parsed.length;
      this.parsed.push({
        array_index: group_position,
        group: true,
        label: group.label,
        title: group.title ? group.title : void 0,
        children: 0,
        disabled: group.disabled,
        classes: group.className
      });
      ref = group.childNodes;
      results1 = [];
      for (i = 0, len = ref.length; i < len; i++) {
        option = ref[i];
        results1.push(this.add_option(option, group_position, group.disabled));
      }
      return results1;
    };

    SelectParser.prototype.add_option = function(option, group_position, group_disabled) {
      if (option.nodeName.toUpperCase() === "OPTION") {
        if (option.text !== "") {
          if (group_position != null) {
            this.parsed[group_position].children += 1;
          }
          this.parsed.push({
            array_index: this.parsed.length,
            options_index: this.options_index,
            value: option.value,
            text: option.text,
            html: option.innerHTML,
            title: option.title ? option.title : void 0,
            selected: option.selected,
            disabled: group_disabled === true ? group_disabled : option.disabled,
            group_array_index: group_position,
            group_label: group_position != null ? this.parsed[group_position].label : null,
            classes: option.className,
            style: option.style.cssText
          });
        } else {
          this.parsed.push({
            array_index: this.parsed.length,
            options_index: this.options_index,
            empty: true
          });
        }
        return this.options_index += 1;
      }
    };

    return SelectParser;

  })();

  SelectParser.select_to_array = function(select) {
    var child, i, len, parser, ref;
    parser = new SelectParser();
    ref = select.childNodes;
    for (i = 0, len = ref.length; i < len; i++) {
      child = ref[i];
      parser.add_node(child);
    }
    return parser.parsed;
  };

  AbstractChosen = (function() {
    function AbstractChosen(form_field, options1) {
      this.form_field = form_field;
      this.options = options1 != null ? options1 : {};
      this.label_click_handler = bind(this.label_click_handler, this);
      if (!AbstractChosen.browser_is_supported()) {
        return;
      }
      this.is_multiple = this.form_field.multiple;
      this.set_default_text();
      this.set_default_values();
      this.setup();
      this.set_up_html();
      this.register_observers();
      this.on_ready();
    }

    AbstractChosen.prototype.set_default_values = function() {
      this.click_test_action = (function(_this) {
        return function(evt) {
          return _this.test_active_click(evt);
        };
      })(this);
      this.activate_action = (function(_this) {
        return function(evt) {
          return _this.activate_field(evt);
        };
      })(this);
      this.active_field = false;
      this.mouse_on_container = false;
      this.results_showing = false;
      this.result_highlighted = null;
      this.is_rtl = this.options.rtl || /\bchosen-rtl\b/.test(this.form_field.className);
      this.allow_single_deselect = (this.options.allow_single_deselect != null) && (this.form_field.options[0] != null) && this.form_field.options[0].text === "" ? this.options.allow_single_deselect : false;
      this.disable_search_threshold = this.options.disable_search_threshold || 0;
      this.disable_search = this.options.disable_search || false;
      this.enable_split_word_search = this.options.enable_split_word_search != null ? this.options.enable_split_word_search : true;
      this.group_search = this.options.group_search != null ? this.options.group_search : true;
      this.search_contains = this.options.search_contains || false;
      this.single_backstroke_delete = this.options.single_backstroke_delete != null ? this.options.single_backstroke_delete : true;
      this.max_selected_options = this.options.max_selected_options || Infinity;
      this.inherit_select_classes = this.options.inherit_select_classes || false;
      this.display_selected_options = this.options.display_selected_options != null ? this.options.display_selected_options : true;
      this.display_disabled_options = this.options.display_disabled_options != null ? this.options.display_disabled_options : true;
      this.include_group_label_in_selected = this.options.include_group_label_in_selected || false;
      this.max_shown_results = this.options.max_shown_results || Number.POSITIVE_INFINITY;
      this.case_sensitive_search = this.options.case_sensitive_search || false;
      return this.hide_results_on_select = this.options.hide_results_on_select != null ? this.options.hide_results_on_select : true;
    };

    AbstractChosen.prototype.set_default_text = function() {
      if (this.form_field.getAttribute("data-placeholder")) {
        this.default_text = this.form_field.getAttribute("data-placeholder");
      } else if (this.is_multiple) {
        this.default_text = this.options.placeholder_text_multiple || this.options.placeholder_text || AbstractChosen.default_multiple_text;
      } else {
        this.default_text = this.options.placeholder_text_single || this.options.placeholder_text || AbstractChosen.default_single_text;
      }
      this.default_text = this.escape_html(this.default_text);
      return this.results_none_found = this.form_field.getAttribute("data-no_results_text") || this.options.no_results_text || AbstractChosen.default_no_result_text;
    };

    AbstractChosen.prototype.choice_label = function(item) {
      if (this.include_group_label_in_selected && (item.group_label != null)) {
        return "<b class='group-name'>" + item.group_label + "</b>" + item.html;
      } else {
        return item.html;
      }
    };

    AbstractChosen.prototype.mouse_enter = function() {
      return this.mouse_on_container = true;
    };

    AbstractChosen.prototype.mouse_leave = function() {
      return this.mouse_on_container = false;
    };

    AbstractChosen.prototype.input_focus = function(evt) {
      if (this.is_multiple) {
        if (!this.active_field) {
          return setTimeout(((function(_this) {
            return function() {
              return _this.container_mousedown();
            };
          })(this)), 50);
        }
      } else {
        if (!this.active_field) {
          return this.activate_field();
        }
      }
    };

    AbstractChosen.prototype.input_blur = function(evt) {
      if (!this.mouse_on_container) {
        this.active_field = false;
        return setTimeout(((function(_this) {
          return function() {
            return _this.blur_test();
          };
        })(this)), 100);
      }
    };

    AbstractChosen.prototype.label_click_handler = function(evt) {
      if (this.is_multiple) {
        return this.container_mousedown(evt);
      } else {
        return this.activate_field();
      }
    };

    AbstractChosen.prototype.results_option_build = function(options) {
      var content, data, data_content, i, len, ref, shown_results;
      content = '';
      shown_results = 0;
      ref = this.results_data;
      for (i = 0, len = ref.length; i < len; i++) {
        data = ref[i];
        data_content = '';
        if (data.group) {
          data_content = this.result_add_group(data);
        } else {
          data_content = this.result_add_option(data);
        }
        if (data_content !== '') {
          shown_results++;
          content += data_content;
        }
        if (options != null ? options.first : void 0) {
          if (data.selected && this.is_multiple) {
            this.choice_build(data);
          } else if (data.selected && !this.is_multiple) {
            this.single_set_selected_text(this.choice_label(data));
          }
        }
        if (shown_results >= this.max_shown_results) {
          break;
        }
      }
      return content;
    };

    AbstractChosen.prototype.result_add_option = function(option) {
      var classes, option_el;
      if (!option.search_match) {
        return '';
      }
      if (!this.include_option_in_results(option)) {
        return '';
      }
      classes = [];
      if (!option.disabled && !(option.selected && this.is_multiple)) {
        classes.push("active-result");
      }
      if (option.disabled && !(option.selected && this.is_multiple)) {
        classes.push("disabled-result");
      }
      if (option.selected) {
        classes.push("result-selected");
      }
      if (option.group_array_index != null) {
        classes.push("group-option");
      }
      if (option.classes !== "") {
        classes.push(option.classes);
      }
      option_el = document.createElement("li");
      option_el.className = classes.join(" ");
      option_el.style.cssText = option.style;
      option_el.setAttribute("data-option-array-index", option.array_index);
      option_el.innerHTML = option.highlighted_html || option.html;
      if (option.title) {
        option_el.title = option.title;
      }
      return this.outerHTML(option_el);
    };

    AbstractChosen.prototype.result_add_group = function(group) {
      var classes, group_el;
      if (!(group.search_match || group.group_match)) {
        return '';
      }
      if (!(group.active_options > 0)) {
        return '';
      }
      classes = [];
      classes.push("group-result");
      if (group.classes) {
        classes.push(group.classes);
      }
      group_el = document.createElement("li");
      group_el.className = classes.join(" ");
      group_el.innerHTML = group.highlighted_html || this.escape_html(group.label);
      if (group.title) {
        group_el.title = group.title;
      }
      return this.outerHTML(group_el);
    };

    AbstractChosen.prototype.results_update_field = function() {
      this.set_default_text();
      if (!this.is_multiple) {
        this.results_reset_cleanup();
      }
      this.result_clear_highlight();
      this.results_build();
      if (this.results_showing) {
        return this.winnow_results();
      }
    };

    AbstractChosen.prototype.reset_single_select_options = function() {
      var i, len, ref, result, results1;
      ref = this.results_data;
      results1 = [];
      for (i = 0, len = ref.length; i < len; i++) {
        result = ref[i];
        if (result.selected) {
          results1.push(result.selected = false);
        } else {
          results1.push(void 0);
        }
      }
      return results1;
    };

    AbstractChosen.prototype.results_toggle = function() {
      if (this.results_showing) {
        return this.results_hide();
      } else {
        return this.results_show();
      }
    };

    AbstractChosen.prototype.results_search = function(evt) {
      if (this.results_showing) {
        return this.winnow_results();
      } else {
        return this.results_show();
      }
    };

    AbstractChosen.prototype.winnow_results = function() {
      var escapedQuery, fix, i, len, option, prefix, query, ref, regex, results, results_group, search_match, startpos, suffix, text;
      this.no_results_clear();
      results = 0;
      query = this.get_search_text();
      escapedQuery = query.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
      regex = this.get_search_regex(escapedQuery);
      ref = this.results_data;
      for (i = 0, len = ref.length; i < len; i++) {
        option = ref[i];
        option.search_match = false;
        results_group = null;
        search_match = null;
        option.highlighted_html = '';
        if (this.include_option_in_results(option)) {
          if (option.group) {
            option.group_match = false;
            option.active_options = 0;
          }
          if ((option.group_array_index != null) && this.results_data[option.group_array_index]) {
            results_group = this.results_data[option.group_array_index];
            if (results_group.active_options === 0 && results_group.search_match) {
              results += 1;
            }
            results_group.active_options += 1;
          }
          text = option.group ? option.label : option.text;
          if (!(option.group && !this.group_search)) {
            search_match = this.search_string_match(text, regex);
            option.search_match = search_match != null;
            if (option.search_match && !option.group) {
              results += 1;
            }
            if (option.search_match) {
              if (query.length) {
                startpos = search_match.index;
                prefix = text.slice(0, startpos);
                fix = text.slice(startpos, startpos + query.length);
                suffix = text.slice(startpos + query.length);
                option.highlighted_html = (this.escape_html(prefix)) + "<em>" + (this.escape_html(fix)) + "</em>" + (this.escape_html(suffix));
              }
              if (results_group != null) {
                results_group.group_match = true;
              }
            } else if ((option.group_array_index != null) && this.results_data[option.group_array_index].search_match) {
              option.search_match = true;
            }
          }
        }
      }
      this.result_clear_highlight();
      if (results < 1 && query.length) {
        this.update_results_content("");
        return this.no_results(query);
      } else {
        this.update_results_content(this.results_option_build());
        return this.winnow_results_set_highlight();
      }
    };

    AbstractChosen.prototype.get_search_regex = function(escaped_search_string) {
      var regex_flag, regex_string;
      regex_string = this.search_contains ? escaped_search_string : "(^|\\s|\\b)" + escaped_search_string + "[^\\s]*";
      if (!(this.enable_split_word_search || this.search_contains)) {
        regex_string = "^" + regex_string;
      }
      regex_flag = this.case_sensitive_search ? "" : "i";
      return new RegExp(regex_string, regex_flag);
    };

    AbstractChosen.prototype.search_string_match = function(search_string, regex) {
      var match;
      match = regex.exec(search_string);
      if (!this.search_contains && (match != null ? match[1] : void 0)) {
        match.index += 1;
      }
      return match;
    };

    AbstractChosen.prototype.choices_count = function() {
      var i, len, option, ref;
      if (this.selected_option_count != null) {
        return this.selected_option_count;
      }
      this.selected_option_count = 0;
      ref = this.form_field.options;
      for (i = 0, len = ref.length; i < len; i++) {
        option = ref[i];
        if (option.selected) {
          this.selected_option_count += 1;
        }
      }
      return this.selected_option_count;
    };

    AbstractChosen.prototype.choices_click = function(evt) {
      evt.preventDefault();
      this.activate_field();
      if (!(this.results_showing || this.is_disabled)) {
        return this.results_show();
      }
    };

    AbstractChosen.prototype.keydown_checker = function(evt) {
      var ref, stroke;
      stroke = (ref = evt.which) != null ? ref : evt.keyCode;
      this.search_field_scale();
      if (stroke !== 8 && this.pending_backstroke) {
        this.clear_backstroke();
      }
      switch (stroke) {
        case 8:
          this.backstroke_length = this.get_search_field_value().length;
          break;
        case 9:
          if (this.results_showing && !this.is_multiple) {
            this.result_select(evt);
          }
          this.mouse_on_container = false;
          break;
        case 13:
          if (this.results_showing) {
            evt.preventDefault();
          }
          break;
        case 27:
          if (this.results_showing) {
            evt.preventDefault();
          }
          break;
        case 32:
          if (this.disable_search) {
            evt.preventDefault();
          }
          break;
        case 38:
          evt.preventDefault();
          this.keyup_arrow();
          break;
        case 40:
          evt.preventDefault();
          this.keydown_arrow();
          break;
      }
    };

    AbstractChosen.prototype.keyup_checker = function(evt) {
      var ref, stroke;
      stroke = (ref = evt.which) != null ? ref : evt.keyCode;
      this.search_field_scale();
      switch (stroke) {
        case 8:
          if (this.is_multiple && this.backstroke_length < 1 && this.choices_count() > 0) {
            this.keydown_backstroke();
          } else if (!this.pending_backstroke) {
            this.result_clear_highlight();
            this.results_search();
          }
          break;
        case 13:
          evt.preventDefault();
          if (this.results_showing) {
            this.result_select(evt);
          }
          break;
        case 27:
          if (this.results_showing) {
            this.results_hide();
          }
          break;
        case 9:
        case 16:
        case 17:
        case 18:
        case 38:
        case 40:
        case 91:
          break;
        default:
          this.results_search();
          break;
      }
    };

    AbstractChosen.prototype.clipboard_event_checker = function(evt) {
      if (this.is_disabled) {
        return;
      }
      return setTimeout(((function(_this) {
        return function() {
          return _this.results_search();
        };
      })(this)), 50);
    };

    AbstractChosen.prototype.container_width = function() {
      if (this.options.width != null) {
        return this.options.width;
      } else {
        return this.form_field.offsetWidth + "px";
      }
    };

    AbstractChosen.prototype.include_option_in_results = function(option) {
      if (this.is_multiple && (!this.display_selected_options && option.selected)) {
        return false;
      }
      if (!this.display_disabled_options && option.disabled) {
        return false;
      }
      if (option.empty) {
        return false;
      }
      return true;
    };

    AbstractChosen.prototype.search_results_touchstart = function(evt) {
      this.touch_started = true;
      return this.search_results_mouseover(evt);
    };

    AbstractChosen.prototype.search_results_touchmove = function(evt) {
      this.touch_started = false;
      return this.search_results_mouseout(evt);
    };

    AbstractChosen.prototype.search_results_touchend = function(evt) {
      if (this.touch_started) {
        return this.search_results_mouseup(evt);
      }
    };

    AbstractChosen.prototype.outerHTML = function(element) {
      var tmp;
      if (element.outerHTML) {
        return element.outerHTML;
      }
      tmp = document.createElement("div");
      tmp.appendChild(element);
      return tmp.innerHTML;
    };

    AbstractChosen.prototype.get_single_html = function() {
      return "<a class=\"chosen-single chosen-default\">\n  <input class=\"chosen-search-input\" type=\"text\" autocomplete=\"off\" />\n  <span>" + this.default_text + "</span>\n  <div><b></b></div>\n</a>\n<div class=\"chosen-drop\">\n  <div class=\"chosen-search\">\n  </div>\n  <ul class=\"chosen-results\"></ul>\n</div>";
    };

    AbstractChosen.prototype.get_multi_html = function() {
      return "<ul class=\"chosen-choices\">\n  <li class=\"search-field\">\n    <input class=\"chosen-search-input\" type=\"text\" autocomplete=\"off\" value=\"" + this.default_text + "\" />\n  </li>\n</ul>\n<div class=\"chosen-drop\">\n  <ul class=\"chosen-results\"></ul>\n</div>";
    };

    AbstractChosen.prototype.get_no_results_html = function(terms) {
      return "<li class=\"no-results\">\n  " + this.results_none_found + " <span>" + (this.escape_html(terms)) + "</span>\n</li>";
    };

    AbstractChosen.browser_is_supported = function() {
      if ("Microsoft Internet Explorer" === window.navigator.appName) {
        return document.documentMode >= 8;
      }
      if (/iP(od|hone)/i.test(window.navigator.userAgent) || /IEMobile/i.test(window.navigator.userAgent) || /Windows Phone/i.test(window.navigator.userAgent) || /BlackBerry/i.test(window.navigator.userAgent) || /BB10/i.test(window.navigator.userAgent) || /Android.*Mobile/i.test(window.navigator.userAgent)) {
        return false;
      }
      return true;
    };

    AbstractChosen.default_multiple_text = "Select Some Options";

    AbstractChosen.default_single_text = "Select an Option";

    AbstractChosen.default_no_result_text = "No results match";

    return AbstractChosen;

  })();

  $ = jQuery;

  $.fn.extend({
    chosen: function(options) {
      if (!AbstractChosen.browser_is_supported()) {
        return this;
      }
      return this.each(function(input_field) {
        var $this, chosen;
        $this = $(this);
        chosen = $this.data('chosen');
        if (options === 'destroy') {
          if (chosen instanceof Chosen) {
            chosen.destroy();
          }
          return;
        }
        if (!(chosen instanceof Chosen)) {
          $this.data('chosen', new Chosen(this, options));
        }
      });
    }
  });

  Chosen = (function(superClass) {
    extend(Chosen, superClass);

    function Chosen() {
      return Chosen.__super__.constructor.apply(this, arguments);
    }

    Chosen.prototype.setup = function() {
      this.form_field_jq = $(this.form_field);
      return this.current_selectedIndex = this.form_field.selectedIndex;
    };

    Chosen.prototype.set_up_html = function() {
      var container_classes, container_props;
      container_classes = ["chosen-container"];
      container_classes.push("chosen-container-" + (this.is_multiple ? "multi" : "single"));
      if (this.inherit_select_classes && this.form_field.className) {
        container_classes.push(this.form_field.className);
      }
      if (this.is_rtl) {
        container_classes.push("chosen-rtl");
      }
      container_props = {
        'class': container_classes.join(' '),
        'title': this.form_field.title
      };
      if (this.form_field.id.length) {
        container_props.id = this.form_field.id.replace(/[^\w]/g, '_') + "_chosen";
      }
      this.container = $("<div />", container_props);
      this.container.width(this.container_width());
      if (this.is_multiple) {
        this.container.html(this.get_multi_html());
      } else {
        this.container.html(this.get_single_html());
      }
      this.form_field_jq.hide().after(this.container);
      this.dropdown = this.container.find('div.chosen-drop').first();
      this.search_field = this.container.find('input').first();
      this.search_results = this.container.find('ul.chosen-results').first();
      this.search_field_scale();
      this.search_no_results = this.container.find('li.no-results').first();
      if (this.is_multiple) {
        this.search_choices = this.container.find('ul.chosen-choices').first();
        this.search_container = this.container.find('li.search-field').first();
      } else {
        this.search_container = this.container.find('div.chosen-search').first();
        this.selected_item = this.container.find('.chosen-single').first();
      }
      this.results_build();
      this.set_tab_index();
      return this.set_label_behavior();
    };

    Chosen.prototype.on_ready = function() {
      return this.form_field_jq.trigger("chosen:ready", {
        chosen: this
      });
    };

    Chosen.prototype.register_observers = function() {
      this.container.on('touchstart.chosen', (function(_this) {
        return function(evt) {
          _this.container_mousedown(evt);
        };
      })(this));
      this.container.on('touchend.chosen', (function(_this) {
        return function(evt) {
          _this.container_mouseup(evt);
        };
      })(this));
      this.container.on('mousedown.chosen', (function(_this) {
        return function(evt) {
          _this.container_mousedown(evt);
        };
      })(this));
      this.container.on('mouseup.chosen', (function(_this) {
        return function(evt) {
          _this.container_mouseup(evt);
        };
      })(this));
      this.container.on('mouseenter.chosen', (function(_this) {
        return function(evt) {
          _this.mouse_enter(evt);
        };
      })(this));
      this.container.on('mouseleave.chosen', (function(_this) {
        return function(evt) {
          _this.mouse_leave(evt);
        };
      })(this));
      this.search_results.on('mouseup.chosen', (function(_this) {
        return function(evt) {
          _this.search_results_mouseup(evt);
        };
      })(this));
      this.search_results.on('mouseover.chosen', (function(_this) {
        return function(evt) {
          _this.search_results_mouseover(evt);
        };
      })(this));
      this.search_results.on('mouseout.chosen', (function(_this) {
        return function(evt) {
          _this.search_results_mouseout(evt);
        };
      })(this));
      this.search_results.on('mousewheel.chosen DOMMouseScroll.chosen', (function(_this) {
        return function(evt) {
          _this.search_results_mousewheel(evt);
        };
      })(this));
      this.search_results.on('touchstart.chosen', (function(_this) {
        return function(evt) {
          _this.search_results_touchstart(evt);
        };
      })(this));
      this.search_results.on('touchmove.chosen', (function(_this) {
        return function(evt) {
          _this.search_results_touchmove(evt);
        };
      })(this));
      this.search_results.on('touchend.chosen', (function(_this) {
        return function(evt) {
          _this.search_results_touchend(evt);
        };
      })(this));
      this.form_field_jq.on("chosen:updated.chosen", (function(_this) {
        return function(evt) {
          _this.results_update_field(evt);
        };
      })(this));
      this.form_field_jq.on("chosen:activate.chosen", (function(_this) {
        return function(evt) {
          _this.activate_field(evt);
        };
      })(this));
      this.form_field_jq.on("chosen:open.chosen", (function(_this) {
        return function(evt) {
          _this.container_mousedown(evt);
        };
      })(this));
      this.form_field_jq.on("chosen:close.chosen", (function(_this) {
        return function(evt) {
          _this.close_field(evt);
        };
      })(this));
      this.search_field.on('blur.chosen', (function(_this) {
        return function(evt) {
          _this.input_blur(evt);
        };
      })(this));
      this.search_field.on('keyup.chosen', (function(_this) {
        return function(evt) {
          _this.keyup_checker(evt);
        };
      })(this));
      this.search_field.on('keydown.chosen', (function(_this) {
        return function(evt) {
          _this.keydown_checker(evt);
        };
      })(this));
      this.search_field.on('focus.chosen', (function(_this) {
        return function(evt) {
          _this.input_focus(evt);
        };
      })(this));
      this.search_field.on('cut.chosen', (function(_this) {
        return function(evt) {
          _this.clipboard_event_checker(evt);
        };
      })(this));
      this.search_field.on('paste.chosen', (function(_this) {
        return function(evt) {
          _this.clipboard_event_checker(evt);
        };
      })(this));
      if (this.is_multiple) {
        return this.search_choices.on('click.chosen', (function(_this) {
          return function(evt) {
            _this.choices_click(evt);
          };
        })(this));
      } else {
        return this.container.on('click.chosen', function(evt) {
          evt.preventDefault();
        });
      }
    };

    Chosen.prototype.destroy = function() {
      $(this.container[0].ownerDocument).off('click.chosen', this.click_test_action);
      if (this.form_field_label.length > 0) {
        this.form_field_label.off('click.chosen');
      }
      if (this.search_field[0].tabIndex) {
        this.form_field_jq[0].tabIndex = this.search_field[0].tabIndex;
      }
      this.container.remove();
      this.form_field_jq.removeData('chosen');
      return this.form_field_jq.show();
    };

    Chosen.prototype.search_field_disabled = function() {
      this.is_disabled = this.form_field.disabled || this.form_field_jq.parents('fieldset').is(':disabled');
      this.container.toggleClass('chosen-disabled', this.is_disabled);
      this.search_field[0].disabled = this.is_disabled;
      if (!this.is_multiple) {
        this.selected_item.off('focus.chosen', this.activate_field);
      }
      if (this.is_disabled) {
        return this.close_field();
      } else if (!this.is_multiple) {
        return this.selected_item.on('focus.chosen', this.activate_field);
      }
    };

    Chosen.prototype.container_mousedown = function(evt) {
      var ref;
      if (this.is_disabled) {
        return;
      }
      if (evt && ((ref = evt.type) === 'mousedown' || ref === 'touchstart') && !this.results_showing) {
        evt.preventDefault();
      }
      if (!((evt != null) && ($(evt.target)).hasClass("search-choice-close"))) {
        if (!this.active_field) {
          if (this.is_multiple) {
            this.search_field.val("");
          }
          $(this.container[0].ownerDocument).on('click.chosen', this.click_test_action);
          this.results_show();
        } else if (!this.is_multiple && evt && (($(evt.target)[0] === this.selected_item[0]) || $(evt.target).parents("a.chosen-single").length)) {
          evt.preventDefault();
          this.results_toggle();
        }
        return this.activate_field();
      }
    };

    Chosen.prototype.container_mouseup = function(evt) {
      if (evt.target.nodeName === "ABBR" && !this.is_disabled) {
        return this.results_reset(evt);
      }
    };

    Chosen.prototype.search_results_mousewheel = function(evt) {
      var delta;
      if (evt.originalEvent) {
        delta = evt.originalEvent.deltaY || -evt.originalEvent.wheelDelta || evt.originalEvent.detail;
      }
      if (delta != null) {
        evt.preventDefault();
        if (evt.type === 'DOMMouseScroll') {
          delta = delta * 40;
        }
        return this.search_results.scrollTop(delta + this.search_results.scrollTop());
      }
    };

    Chosen.prototype.blur_test = function(evt) {
      if (!this.active_field && this.container.hasClass("chosen-container-active")) {
        return this.close_field();
      }
    };

    Chosen.prototype.close_field = function() {
      $(this.container[0].ownerDocument).off("click.chosen", this.click_test_action);
      this.active_field = false;
      this.results_hide();
      this.container.removeClass("chosen-container-active");
      this.clear_backstroke();
      this.show_search_field_default();
      this.search_field_scale();
      return this.search_field.blur();
    };

    Chosen.prototype.activate_field = function() {
      if (this.is_disabled) {
        return;
      }
      this.container.addClass("chosen-container-active");
      this.active_field = true;
      this.search_field.val(this.search_field.val());
      return this.search_field.focus();
    };

    Chosen.prototype.test_active_click = function(evt) {
      var active_container;
      active_container = $(evt.target).closest('.chosen-container');
      if (active_container.length && this.container[0] === active_container[0]) {
        return this.active_field = true;
      } else {
        return this.close_field();
      }
    };

    Chosen.prototype.results_build = function() {
      this.parsing = true;
      this.selected_option_count = null;
      this.results_data = SelectParser.select_to_array(this.form_field);
      if (this.is_multiple) {
        this.search_choices.find("li.search-choice").remove();
      } else if (!this.is_multiple) {
        this.single_set_selected_text();
        if (this.disable_search || this.form_field.options.length <= this.disable_search_threshold) {
          this.search_field[0].readOnly = true;
          this.container.addClass("chosen-container-single-nosearch");
        } else {
          this.search_field[0].readOnly = false;
          this.container.removeClass("chosen-container-single-nosearch");
        }
      }
      this.update_results_content(this.results_option_build({
        first: true
      }));
      this.search_field_disabled();
      this.show_search_field_default();
      this.search_field_scale();
      return this.parsing = false;
    };

    Chosen.prototype.result_do_highlight = function(el) {
      var high_bottom, high_top, maxHeight, visible_bottom, visible_top;
      if (el.length) {
        this.result_clear_highlight();
        this.result_highlight = el;
        this.result_highlight.addClass("highlighted");
        maxHeight = parseInt(this.search_results.css("maxHeight"), 10);
        visible_top = this.search_results.scrollTop();
        visible_bottom = maxHeight + visible_top;
        high_top = this.result_highlight.position().top + this.search_results.scrollTop();
        high_bottom = high_top + this.result_highlight.outerHeight();
        if (high_bottom >= visible_bottom) {
          return this.search_results.scrollTop((high_bottom - maxHeight) > 0 ? high_bottom - maxHeight : 0);
        } else if (high_top < visible_top) {
          return this.search_results.scrollTop(high_top);
        }
      }
    };

    Chosen.prototype.result_clear_highlight = function() {
      if (this.result_highlight) {
        this.result_highlight.removeClass("highlighted");
      }
      return this.result_highlight = null;
    };

    Chosen.prototype.results_show = function() {
      if (this.is_multiple && this.max_selected_options <= this.choices_count()) {
        this.form_field_jq.trigger("chosen:maxselected", {
          chosen: this
        });
        return false;
      }
      if (!this.is_multiple) {
        this.search_container.append(this.search_field);
      }
      this.container.addClass("chosen-with-drop");
      this.results_showing = true;
      this.search_field.focus();
      this.search_field.val(this.get_search_field_value());
      this.winnow_results();
      return this.form_field_jq.trigger("chosen:showing_dropdown", {
        chosen: this
      });
    };

    Chosen.prototype.update_results_content = function(content) {
      return this.search_results.html(content);
    };

    Chosen.prototype.results_hide = function() {
      if (this.results_showing) {
        this.result_clear_highlight();
        if (!this.is_multiple) {
          this.selected_item.prepend(this.search_field);
          this.search_field.focus();
        }
        this.container.removeClass("chosen-with-drop");
        this.form_field_jq.trigger("chosen:hiding_dropdown", {
          chosen: this
        });
      }
      return this.results_showing = false;
    };

    Chosen.prototype.set_tab_index = function(el) {
      var ti;
      if (this.form_field.tabIndex) {
        ti = this.form_field.tabIndex;
        this.form_field.tabIndex = -1;
        return this.search_field[0].tabIndex = ti;
      }
    };

    Chosen.prototype.set_label_behavior = function() {
      this.form_field_label = this.form_field_jq.parents("label");
      if (!this.form_field_label.length && this.form_field.id.length) {
        this.form_field_label = $("label[for='" + this.form_field.id + "']");
      }
      if (this.form_field_label.length > 0) {
        return this.form_field_label.on('click.chosen', this.label_click_handler);
      }
    };

    Chosen.prototype.show_search_field_default = function() {
      if (this.is_multiple && this.choices_count() < 1 && !this.active_field) {
        this.search_field.val(this.default_text);
        return this.search_field.addClass("default");
      } else {
        this.search_field.val("");
        return this.search_field.removeClass("default");
      }
    };

    Chosen.prototype.search_results_mouseup = function(evt) {
      var target;
      target = $(evt.target).hasClass("active-result") ? $(evt.target) : $(evt.target).parents(".active-result").first();
      if (target.length) {
        this.result_highlight = target;
        this.result_select(evt);
        return this.search_field.focus();
      }
    };

    Chosen.prototype.search_results_mouseover = function(evt) {
      var target;
      target = $(evt.target).hasClass("active-result") ? $(evt.target) : $(evt.target).parents(".active-result").first();
      if (target) {
        return this.result_do_highlight(target);
      }
    };

    Chosen.prototype.search_results_mouseout = function(evt) {
      if ($(evt.target).hasClass("active-result") || $(evt.target).parents('.active-result').first()) {
        return this.result_clear_highlight();
      }
    };

    Chosen.prototype.choice_build = function(item) {
      var choice, close_link;
      choice = $('<li />', {
        "class": "search-choice"
      }).html("<span>" + (this.choice_label(item)) + "</span>");
      if (item.disabled) {
        choice.addClass('search-choice-disabled');
      } else {
        close_link = $('<a />', {
          "class": 'search-choice-close',
          'data-option-array-index': item.array_index
        });
        close_link.on('click.chosen', (function(_this) {
          return function(evt) {
            return _this.choice_destroy_link_click(evt);
          };
        })(this));
        choice.append(close_link);
      }
      return this.search_container.before(choice);
    };

    Chosen.prototype.choice_destroy_link_click = function(evt) {
      evt.preventDefault();
      evt.stopPropagation();
      if (!this.is_disabled) {
        return this.choice_destroy($(evt.target));
      }
    };

    Chosen.prototype.choice_destroy = function(link) {
      if (this.result_deselect(link[0].getAttribute("data-option-array-index"))) {
        if (this.active_field) {
          this.search_field.focus();
        } else {
          this.show_search_field_default();
        }
        if (this.is_multiple && this.choices_count() > 0 && this.get_search_field_value().length < 1) {
          this.results_hide();
        }
        link.parents('li').first().remove();
        return this.search_field_scale();
      }
    };

    Chosen.prototype.results_reset = function() {
      this.reset_single_select_options();
      this.form_field.options[0].selected = true;
      this.single_set_selected_text();
      this.show_search_field_default();
      this.results_reset_cleanup();
      this.trigger_form_field_change();
      if (this.active_field) {
        return this.results_hide();
      }
    };

    Chosen.prototype.results_reset_cleanup = function() {
      this.current_selectedIndex = this.form_field.selectedIndex;
      return this.selected_item.find("abbr").remove();
    };

    Chosen.prototype.result_select = function(evt) {
      var high, item;
      if (this.result_highlight) {
        high = this.result_highlight;
        this.result_clear_highlight();
        if (this.is_multiple && this.max_selected_options <= this.choices_count()) {
          this.form_field_jq.trigger("chosen:maxselected", {
            chosen: this
          });
          return false;
        }
        if (this.is_multiple) {
          high.removeClass("active-result");
        } else {
          this.reset_single_select_options();
        }
        high.addClass("result-selected");
        item = this.results_data[high[0].getAttribute("data-option-array-index")];
        item.selected = true;
        this.form_field.options[item.options_index].selected = true;
        this.selected_option_count = null;
        this.search_field.val("");
        if (this.is_multiple) {
          this.choice_build(item);
        } else {
          this.single_set_selected_text(this.choice_label(item));
        }
        if (this.is_multiple && (!this.hide_results_on_select || (evt.metaKey || evt.ctrlKey))) {
          this.winnow_results();
        } else {
          this.results_hide();
          this.show_search_field_default();
        }
        if (this.is_multiple || this.form_field.selectedIndex !== this.current_selectedIndex) {
          this.trigger_form_field_change({
            selected: this.form_field.options[item.options_index].value
          });
        }
        this.current_selectedIndex = this.form_field.selectedIndex;
        evt.preventDefault();
        return this.search_field_scale();
      }
    };

    Chosen.prototype.single_set_selected_text = function(text) {
      if (text == null) {
        text = this.default_text;
      }
      if (text === this.default_text) {
        this.selected_item.addClass("chosen-default");
      } else {
        this.single_deselect_control_build();
        this.selected_item.removeClass("chosen-default");
      }
      return this.selected_item.find("span").html(text);
    };

    Chosen.prototype.result_deselect = function(pos) {
      var result_data;
      result_data = this.results_data[pos];
      if (!this.form_field.options[result_data.options_index].disabled) {
        result_data.selected = false;
        this.form_field.options[result_data.options_index].selected = false;
        this.selected_option_count = null;
        this.result_clear_highlight();
        if (this.results_showing) {
          this.winnow_results();
        }
        this.trigger_form_field_change({
          deselected: this.form_field.options[result_data.options_index].value
        });
        this.search_field_scale();
        return true;
      } else {
        return false;
      }
    };

    Chosen.prototype.single_deselect_control_build = function() {
      if (!this.allow_single_deselect) {
        return;
      }
      if (!this.selected_item.find("abbr").length) {
        this.selected_item.find("span").first().after("<abbr class=\"search-choice-close\"></abbr>");
      }
      return this.selected_item.addClass("chosen-single-with-deselect");
    };

    Chosen.prototype.get_search_field_value = function() {
      return this.search_field.val();
    };

    Chosen.prototype.get_search_text = function() {
      return $.trim(this.get_search_field_value());
    };

    Chosen.prototype.escape_html = function(text) {
      return $('<div/>').text(text).html();
    };

    Chosen.prototype.winnow_results_set_highlight = function() {
      var do_high, selected_results;
      selected_results = !this.is_multiple ? this.search_results.find(".result-selected.active-result") : [];
      do_high = selected_results.length ? selected_results.first() : this.search_results.find(".active-result").first();
      if (do_high != null) {
        return this.result_do_highlight(do_high);
      }
    };

    Chosen.prototype.no_results = function(terms) {
      var no_results_html;
      no_results_html = this.get_no_results_html(terms);
      this.search_results.append(no_results_html);
      return this.form_field_jq.trigger("chosen:no_results", {
        chosen: this
      });
    };

    Chosen.prototype.no_results_clear = function() {
      return this.search_results.find(".no-results").remove();
    };

    Chosen.prototype.keydown_arrow = function() {
      var next_sib;
      if (this.results_showing && this.result_highlight) {
        next_sib = this.result_highlight.nextAll("li.active-result").first();
        if (next_sib) {
          return this.result_do_highlight(next_sib);
        }
      } else {
        return this.results_show();
      }
    };

    Chosen.prototype.keyup_arrow = function() {
      var prev_sibs;
      if (!this.results_showing && !this.is_multiple) {
        return this.results_show();
      } else if (this.result_highlight) {
        prev_sibs = this.result_highlight.prevAll("li.active-result");
        if (prev_sibs.length) {
          return this.result_do_highlight(prev_sibs.first());
        } else {
          if (this.choices_count() > 0) {
            this.results_hide();
          }
          return this.result_clear_highlight();
        }
      }
    };

    Chosen.prototype.keydown_backstroke = function() {
      var next_available_destroy;
      if (this.pending_backstroke) {
        this.choice_destroy(this.pending_backstroke.find("a").first());
        return this.clear_backstroke();
      } else {
        next_available_destroy = this.search_container.siblings("li.search-choice").last();
        if (next_available_destroy.length && !next_available_destroy.hasClass("search-choice-disabled")) {
          this.pending_backstroke = next_available_destroy;
          if (this.single_backstroke_delete) {
            return this.keydown_backstroke();
          } else {
            return this.pending_backstroke.addClass("search-choice-focus");
          }
        }
      }
    };

    Chosen.prototype.clear_backstroke = function() {
      if (this.pending_backstroke) {
        this.pending_backstroke.removeClass("search-choice-focus");
      }
      return this.pending_backstroke = null;
    };

    Chosen.prototype.search_field_scale = function() {
      var div, i, len, style, style_block, styles, width;
      if (!this.is_multiple) {
        return;
      }
      style_block = {
        position: 'absolute',
        left: '-1000px',
        top: '-1000px',
        display: 'none',
        whiteSpace: 'pre'
      };
      styles = ['fontSize', 'fontStyle', 'fontWeight', 'fontFamily', 'lineHeight', 'textTransform', 'letterSpacing'];
      for (i = 0, len = styles.length; i < len; i++) {
        style = styles[i];
        style_block[style] = this.search_field.css(style);
      }
      div = $('<div />').css(style_block);
      div.text(this.get_search_field_value());
      $('body').append(div);
      width = div.width() + 25;
      div.remove();
      if (this.container.is(':visible')) {
        width = Math.min(this.container.outerWidth() - 10, width);
      }
      return this.search_field.width(width);
    };

    Chosen.prototype.trigger_form_field_change = function(extra) {
      this.form_field_jq.trigger("input", extra);
      return this.form_field_jq.trigger("change", extra);
    };

    return Chosen;

  })(AbstractChosen);

}).call(this);
;
/* global log4javascript, window */

/* jshint browser:true, camelcase:false, devel:true, jquery:true */

(function () {
  'use strict';
}());

var log;

if (typeof log4javascript !== 'undefined') {
    log = (function () {
        var appender,
            layout,
            logger;
        logger = log4javascript.getLogger();
        appender = new log4javascript.BrowserConsoleAppender();
        layout = new log4javascript.SimpleLayout();
        appender.setLayout(layout);
        logger.addAppender(appender);
        return logger;
    }());
} else {
    log = {};
    if (window.console && window.console.log) {
        log.logger = function (inJunk) {
            window.console.log(inJunk);
        };
    } else {
        log.logger = function () { };
    }
    log.info = log.logger;
    log.warn = log.logger;
    log.error = log.logger;
}
;
// Based of implementation by Erik Karlsson (www.nonobtrusive.com)
// available at http://www.nonobtrusive.com/2009/07/24/.

/* jshint browser:true, camelcase:false, devel:true, jquery:true */

'use strict';

var CustomEvent = function () {
    this.events = [];

    this.addEventlistener = function (event, callback) {
        this.events[event] = this.events[event] || [];
        if (this.events[event]) {
            this.events[event].push(callback);
        }
    };

    this.removeEventlistener = function (event, callback) {
        var i,
            listeners;
        if (this.events[event]) {
            listeners = this.events[event];
            for (i = listeners.length - 1; i >= 0; i -= 1) {
                if (listeners[i] === callback) {
                    listeners.splice(i, 1);
                    return true;
                }
            }
        }
        return false;
    };

    this.dispatch = function (event, args) {
        if (this.events[event]) {
            var listeners = this.events[event], len = listeners.length;
            while (len > 0) {
                len -= 1;
                listeners[len](args);
            }
        }
    };
};
;
/* global google, gettext */
/* jshint browser:true, camelcase:false, devel:true, jquery:true */

(function () {
  "use strict";
}());

var MapStyles = {
    changeStyleButton: function (text) {
        return (
            "<a id='change-style-button' onclick=\"MapPage.changeStyle();\">" +
            text + "</a>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"
        );
    },

    mapStyles: function (map) {
        // These styles where developed using the GMap StyleTool
        // found here:
        // http://gmaps-samples-v3.googlecode.com/svn/trunk/styledmaps/wizard/index.html
        var styles = [
            {
                "featureType": "all",
                "elementType": "all",
                "stylers": [
                    {
                        "saturation": "-15"
                    },
                    {
                        "lightness": "15"
                    },
                    {
                        "visibility": "simplified"
                    },
                    {
                        "gamma": "0.8"
                    },
                ]
            },
            {
                "elementType": "labels.icon",
                "stylers": [
                  {
                    "visibility": "off"
                  }
                ]
            },
            {
                "featureType": "landscape.man_made",
                "elementType": "all",
                "stylers": [
                    {
                        "visibility": "off"
                    }
                ]
            },
            {
                "featureType": "poi.business",
                "elementType": "all",
                "stylers": [
                    {
                        "visibility": "off"
                    }
                ]
            },
            {
                "featureType": "poi.place_of_worship",
                "elementType": "all",
                "stylers": [
                    {
                        "visibility": "off"
                    }
                ]
            },   {
                "elementType": "labels.text",
                "stylers": [
                  {
                    "saturation": -100
                  },
                  {
                    "lightness": -5
                  },
                  {
                    "visibility": "simplified"
                  }
                ]}
        ];

        // Create a new StyledMapType object, passing it the array of styles,
        // as well as the name to be displayed on the map type control.
        var styledMap = new google.maps.StyledMapType(styles, {
            name: "Basic Map"
        });

        //Associate the styled map with the MapTypeId and set it to display.
        // NOTE: this method of applying style also removes Google"s `Report`
        //  button from the map, giving us more space
        map.mapTypes.set("map_style", styledMap);
        map.setMapTypeId("map_style");
    },

    darkStyle: function (map) {
        var styles = [
            {
              "elementType": "geometry",
              "stylers": [
                {
                  "color": "#212121"
                }
              ]
            },
            {
              "elementType": "labels.icon",
              "stylers": [
                {
                  "visibility": "off"
                }
              ]
            },
            {
              "elementType": "labels.text.fill",
              "stylers": [
                {
                  "color": "#757575"
                }
              ]
            },
            {
              "elementType": "labels.text.stroke",
              "stylers": [
                {
                  "color": "#212121"
                }
              ]
            },
            {
              "featureType": "administrative",
              "elementType": "geometry",
              "stylers": [
                {
                  "color": "#757575"
                }
              ]
            },
            {
              "featureType": "administrative.country",
              "elementType": "labels.text.fill",
              "stylers": [
                {
                  "color": "#9e9e9e"
                }
              ]
            },
            {
              "featureType": "administrative.land_parcel",
              "stylers": [
                {
                  "visibility": "off"
                }
              ]
            },
            {
              "featureType": "administrative.locality",
              "elementType": "labels.text.fill",
              "stylers": [
                {
                  "color": "#bdbdbd"
                }
              ]
            },
            {
              "featureType": "poi",
              "elementType": "labels.text.fill",
              "stylers": [
                {
                  "color": "#757575"
                }
              ]
            },
            {
              "featureType": "poi.park",
              "elementType": "geometry",
              "stylers": [
                {
                  "color": "#181818"
                }
              ]
            },
            {
              "featureType": "poi.park",
              "elementType": "labels.text.fill",
              "stylers": [
                {
                  "color": "#616161"
                }
              ]
            },
            {
              "featureType": "poi.park",
              "elementType": "labels.text.stroke",
              "stylers": [
                {
                  "color": "#1b1b1b"
                }
              ]
            },
            {
              "featureType": "road",
              "elementType": "geometry.fill",
              "stylers": [
                {
                  "color": "#2c2c2c"
                }
              ]
            },
            {
              "featureType": "road",
              "elementType": "labels.text.fill",
              "stylers": [
                {
                  "color": "#8a8a8a"
                }
              ]
            },
            {
              "featureType": "road.arterial",
              "elementType": "geometry",
              "stylers": [
                {
                  "color": "#373737"
                }
              ]
            },
            {
              "featureType": "road.highway",
              "elementType": "geometry",
              "stylers": [
                {
                  "color": "#3c3c3c"
                }
              ]
            },
            {
              "featureType": "road.highway.controlled_access",
              "elementType": "geometry",
              "stylers": [
                {
                  "color": "#4e4e4e"
                }
              ]
            },
            {
              "featureType": "road.local",
              "elementType": "labels.text.fill",
              "stylers": [
                {
                  "color": "#616161"
                }
              ]
            },
            {
              "featureType": "transit",
              "elementType": "labels.text.fill",
              "stylers": [
                {
                  "color": "#757575"
                }
              ]
            },
            {
              "featureType": "water",
              "elementType": "geometry",
              "stylers": [
                {
                  "color": "#000000"
                }
              ]
            },
            {
              "featureType": "water",
              "elementType": "labels.text.fill",
              "stylers": [
                {
                  "color": "#3d3d3d"
                }
              ]
            }
        ];

        // Create a new StyledMapType object, passing it the array of styles,
        // as well as the name to be displayed on the map type control.
        var styledMap = new google.maps.StyledMapType(styles, {
            name: "Dark Map"
        });

        //Associate the styled map with the MapTypeId and set it to display.
        // NOTE: this method of applying style also removes Google"s `Report`
        //  button from the map, giving us more space
        map.mapTypes.set("map_style", styledMap);
        map.setMapTypeId("map_style");
    },

    silverStyle: function (map) {
        var styles = [
            {
              "elementType": "geometry",
              "stylers": [
                {
                  "color": "#f5f5f5"
                }
              ]
            },
            {
              "elementType": "labels.icon",
              "stylers": [
                {
                  "visibility": "off"
                }
              ]
            },
            {
              "elementType": "labels.text.fill",
              "stylers": [
                {
                  "color": "#616161"
                }
              ]
            },
            {
              "elementType": "labels.text.stroke",
              "stylers": [
                {
                  "color": "#f5f5f5"
                }
              ]
            },
            {
              "featureType": "administrative.land_parcel",
              "elementType": "labels.text.fill",
              "stylers": [
                {
                  "color": "#bdbdbd"
                }
              ]
            },
            {
              "featureType": "poi",
              "elementType": "geometry",
              "stylers": [
                {
                  "color": "#eeeeee"
                }
              ]
            },
            {
              "featureType": "poi",
              "elementType": "labels.text.fill",
              "stylers": [
                {
                  "color": "#757575"
                }
              ]
            },
            {
              "featureType": "poi.park",
              "elementType": "geometry",
              "stylers": [
                {
                  "color": "#e5e5e5"
                }
              ]
            },
            {
              "featureType": "poi.park",
              "elementType": "labels.text.fill",
              "stylers": [
                {
                  "color": "#9e9e9e"
                }
              ]
            },
            {
              "featureType": "road",
              "elementType": "geometry",
              "stylers": [
                {
                  "color": "#ffffff"
                }
              ]
            },
            {
              "featureType": "road.arterial",
              "elementType": "labels.text.fill",
              "stylers": [
                {
                  "color": "#757575"
                }
              ]
            },
            {
              "featureType": "road.highway",
              "elementType": "geometry",
              "stylers": [
                {
                  "color": "#dadada"
                }
              ]
            },
            {
              "featureType": "road.highway",
              "elementType": "labels.text.fill",
              "stylers": [
                {
                  "color": "#616161"
                }
              ]
            },
            {
              "featureType": "road.local",
              "elementType": "labels.text.fill",
              "stylers": [
                {
                  "color": "#9e9e9e"
                }
              ]
            },
            {
              "featureType": "transit.line",
              "elementType": "geometry",
              "stylers": [
                {
                  "color": "#e5e5e5"
                }
              ]
            },
            {
              "featureType": "transit.station",
              "elementType": "geometry",
              "stylers": [
                {
                  "color": "#eeeeee"
                }
              ]
            },
            {
              "featureType": "water",
              "elementType": "geometry",
              "stylers": [
                {
                  "color": "#c9c9c9"
                }
              ]
            },
            {
              "featureType": "water",
              "elementType": "labels.text.fill",
              "stylers": [
                {
                  "color": "#9e9e9e"
                }
              ]
            }
          ];

        // Create a new StyledMapType object, passing it the array of styles,
        // as well as the name to be displayed on the map type control.
        var styledMap = new google.maps.StyledMapType(styles, {
            name: "Silver Map"
        });

        //Associate the styled map with the MapTypeId and set it to display.
        // NOTE: this method of applying style also removes Google"s `Report`
        //  button from the map, giving us more space
        map.mapTypes.set("map_style", styledMap);
        map.setMapTypeId("map_style");
    }
};
;
/*global CustomEvent, google, InfoBubble, PimConfig, PimUtil, reSizeBody,
    OffSM, OnSM, Facility, gettext, DRAG_END, MapStyles, Filter */

/* jshint browser:true, camelcase:false, devel:true, jquery:true, nomen:false */

var MapPage = function () {
    /**
     * Map used for conveying parking information to and from end users.
     * @lends ParkipediaMap.prototype
     */

    this.lat = null;
    this.lng = null;

    this.infoWindow = null;

    // Send Analytics on first drag
    this.firstDrag = true;

    /**
     * Create a new map centered at (x, y) with zoom z.
     * @constructs
     *
     * @param {Int} lat Latitude of map center.
     * @param {Int} lng Longitude of map center.
     * @param {Int} zoom Initial map zoom factor.
     */
    this.initialize = function (lat, lng, zoom, mapPage) {
        var container,
            mapOpts,
            thisMap,
            scrollToZoom = PimConfig.configParams.scrollToZoom;

        thisMap = this;

        // Enable the visual refresh
        // https://developers.google.com/maps/documentation/javascript/basics#EnableVisualRefresh
        google.maps.visualRefresh = true;

        // Instantiate the map
        mapOpts = {
            center: new google.maps.LatLng(lat, lng),
            zoom: zoom,
            scrollwheel: scrollToZoom,
            disableDefaultUI: true,
            gestureHandling: 'greedy',
            navigationControl: true,
            navigationControlOptions: {
                style: google.maps.NavigationControlStyle.SMALL
            },
            zoomControl: false,
            mapTypeId: google.maps.MapTypeId.ROADMAP,
            maxZoom: PimConfig.configParams.maxzoom,
            minZoom: PimConfig.configParams.minzoom
        };
        container = document.getElementById('fullsize');
        MapPage.map = new google.maps.Map(container, mapOpts);

        // Custom map styles.
        MapStyles.mapStyles(MapPage.map);
        MapStyles.style = 'Basic';

        this.lat = MapPage.map.getCenter().lat();
        this.lng = MapPage.map.getCenter().lng();

        google.maps.event.addListener(MapPage.map, 'click', function () {
            thisMap.closeAllInfoWindows();
        });

        // Additions to map.  Many of this are optional and configured
        // using the optConfig option passed into this constructor.
        this.addTimeBox();
        this.addNavigationButtons();
        this.addCopyright();
        this.mobileDropdownButtons();
        this.addTrafficTransitLayers();

        if (PimConfig.MAP_TYPE === 'DESKTOP') {
            this.buildMapBtn();
        }

        /* ********************************** */
        /* Nasty hack to limit firing of idle */
        /* ********************************** */

        google.maps.event.addListener(MapPage.map, 'idle', function () {
            // Only refresh map after 2 seconds
            if (MapPage.changetm) {
                clearTimeout(MapPage.changetm);
            }
            MapPage.changetm = setTimeout(function () {
                MapPage.customEvents.dispatch('true_idle')
            }, 1000);

            // HACK: to fix the google infobubble tweaks added in 3.13
            // http://stackoverflow.com/questions/18281770/disable-css-styles-in-google-maps-3-14-infowindow
            $('.gm-style').removeClass('gm-style');
        });

        google.maps.event.addListener(MapPage.map, 'center_changed', function () {
            thisMap.checkBounds();
        });

        /* ********************************** */
        /* End hack                           */
        /* ********************************** */

        // Store pointer back to the containing MapPage
        this.mapPage = mapPage;
    };

    // If the map position is out of range, move it back
    this.checkBounds = function () {

        var allowedBounds,
            center,
            x,
            y,
            aMaxX,
            aMaxY,
            aMinX,
            aMinY,
            moveToEdge;

        if (!PimConfig.configParams.bounds) {
            return;
        }

        // The allowed region which the whole map must be within
        allowedBounds = new google.maps.LatLngBounds(
            new google.maps.LatLng(
                this.lat - PimConfig.BOUND_SIZE,
                this.lng - PimConfig.BOUND_SIZE
            ),
            new google.maps.LatLng(
                this.lat + PimConfig.BOUND_SIZE,
                this.lng + PimConfig.BOUND_SIZE
            )
        );

        center = MapPage.map.getCenter();
        x = center.lng();
        y = center.lat();

        // Perform the check and return if OK
        if (allowedBounds.contains(MapPage.map.getCenter())) {
            return;
        }

        // It`s not OK, so find the nearest allowed point and move there
        aMaxX = allowedBounds.getNorthEast().lng();
        aMaxY = allowedBounds.getNorthEast().lat();
        aMinX = allowedBounds.getSouthWest().lng();
        aMinY = allowedBounds.getSouthWest().lat();

        if (x < aMinX) {x = aMinX; }
        if (x > aMaxX) {x = aMaxX; }
        if (y < aMinY) {y = aMinY; }
        if (y > aMaxY) {y = aMaxY; }

        moveToEdge = new google.maps.LatLng(y, x);
        MapPage.map.setCenter(moveToEdge);
    };

    this.addCopyright = function () {

        this.copyrightDiv = document.createElement('div');
        this.copyrightDiv.className = 'copyright';

        this.copyrightDiv.innerHTML = '<a href="http://www.parkme.com/privacy">Copyright &copy;2011-' +
            new Date().getFullYear() + ' ParkMe</a>';

        // Put legends on map
        MapPage.map.controls[google.maps.ControlPosition.BOTTOM_RIGHT].push(
            this.copyrightDiv
        );

    };

    this.buildMapBtn = function () {

        this.btnDiv = document.createElement('div');
        this.btnDiv.className = 'build-map-btn uppercase';

        this.btnDiv.innerHTML = MapStyles.changeStyleButton(MapStyles.style);

        // Put button on map
        MapPage.map.controls[google.maps.ControlPosition.TOP_RIGHT].push(
            this.btnDiv
        );

    };

    this.addTimeBox = function () {

        // check config
        if (PimConfig.configParams.hasTime !== true) {
            return false;
        }

        this.timeBoxDiv = document.createElement('div');
        this.timeBoxDiv.className = 'timebox';

        this.timeBoxDiv.innerHTML = '<span class="time_output"></span>';

        // Put legends on map
        MapPage.map.controls[google.maps.ControlPosition.RIGHT_TOP].push(
            this.timeBoxDiv
        );

    };

    this.addNavigationButtons = function () {

        var locationButtonDiv,
            buttonPosition = google.maps.ControlPosition.RIGHT_BOTTOM,
            map = MapPage.map,
            fullMapURL,
            fullMapBtn = document.getElementById('full-map-btn'),
            isLotPage = PimConfig.MAP_TYPE === 'LOTPAGE';

        locationButtonDiv = document.createElement('div');
        locationButtonDiv.className = 'nav';

        // If on a lot/quote page, get the full map btn url
        // (the current lot) and render lot-specific nav buttons.
        if (isLotPage) {
            fullMapURL = fullMapBtn.getElementsByTagName('a')[0].getAttribute('href');
            locationButtonDiv.innerHTML += '<div class="nav-item nav-lot-item nav-plus"></div>';
            locationButtonDiv.innerHTML += '<div class="nav-item nav-lot-item nav-minus"></div>';
            locationButtonDiv.innerHTML += '<div data-tooltip="' + gettext('Show Full Map') +
                                            '" class="nav-item nav-lot-item nav-full-map"></div>';
        } else {
            locationButtonDiv.innerHTML += '<div class="nav-item nav-plus"></div>';
            locationButtonDiv.innerHTML += '<div class="nav-item nav-minus"></div>';
            locationButtonDiv.innerHTML += '<div class="nav-item nav-locate"></div>';
        }


        // Zoom In
        locationButtonDiv.children[0].onclick = function () {
            map.setZoom(map.getZoom() + 1);
        };

        // Zoom Out
        locationButtonDiv.children[1].onclick = function () {
            map.setZoom(map.getZoom() - 1);
        };

        // Geo Locate
        locationButtonDiv.children[2].onclick = function () {
            // If on a lot/quote page, full map nav button
            // goes to the lot on the webmap
            if (isLotPage) {
              if ($('.breadcrumb li a').length) {
                window.location.href = fullMapURL + '#' +
                    encodeURI($('.breadcrumb li a').text().split(' Parking')[0]);
              } else {
                window.location.href = fullMapURL + '#';
              }
            } else if (isLotPage && queryParse.lot) {
                // Or if on the opboard lot details page,
                // lot is set by the query param (lot)
                window.location.href = PimUtil.getVirtualHost('www') +
                    '/map/?lot=' + queryParse.lot;
            } else {
                // Otherwise, use geolocation
                MapPage.geolocator.getLocation();
            }
        };

        // Put legends on map
        MapPage.map.controls[buttonPosition].push(
            locationButtonDiv
        );

        // Show/Hide filter panel
        $('#open_close_pane').click(function () {
            if ($('#open_close_pane').text() === '◀') {
                $('#panel').animate({
                    width: '0px'
                }, 100, function () {
                    $('#open_close_pane').css('left', '0px').text('▶');
                    reSizeBody();
                });

            } else {
                $('#panel').width('465px');
                $('#open_close_pane').css('left', '465px').text('◀');
                reSizeBody();
            }
        });

    };

    // enable toggle functionality of buttons
    this.mobileDropdownButtons = function () {
        $('#search_bt').click(function () {
            $('#duration_drop_down').hide();
            $('#mobile-panel').removeClass('open');
            $('#search_drop_down').toggle();
        });

        $('.duration_bt').click(function () {
            $('#search_drop_down').hide();
            $('#mobile-panel').removeClass('open');
            $('#duration_drop_down, .select_a_date').slideToggle();

            // If the filter is showing, slide them up.
            if ($('#filter_drop_down').is(':visible')) {
                $('#filter_drop_down').slideToggle();
            }
        });

        // Controls both webmap and nearby lots filters.
        $('#mobile-filter').click(function () {
            $('#search_drop_down').hide();
            $('#mobile-panel').removeClass('open');
            $('#filter_drop_down').slideToggle();

            // If the datepickers are showing, slide them up.
            if ($('.select_a_date').is(':visible')) {
                $('.select_a_date').slideToggle();
            }

            if ($('#duration_drop_down').is(':visible')) {
                $('#duration_drop_down').slideToggle();
            }
        });

        // Toggle up filter/duration dropdowns if visible.
        $('#layer-dropdown').click(function() {
            if ($('#filter_drop_down').is(':visible')) {
                $('#filter_drop_down').slideToggle();
            }

            if ($('#duration_drop_down').is(':visible')) {
                $('#duration_drop_down').slideToggle();
            }
        });
    };

    // Shows the offstreet layer
    this.showLots = function () {
        // Resets the filter; prevents
        // Street to Daily/Reserve/Monthly
        // switch from running the wrong api call.
        PimConfig.configParams.filter = '';

        // Don't reshow if already active
        if (OffSM.active) {
            return;
        }

        // First activate and then de-active
        OnSM.active = false;
        OffSM.active = true;

        // Hide polylines.
        $.each(OnSM.cache, function () {
            this.marker.hideMarker();
        });

        // If market poly exists, hide it
        // when switching to lots.
        if (OnSM.marketPolyCache.marketPoly) {
            // Clears the market poly when zoom in.
            // Loop thru each poly and clear it from the map.
            for (var poly in OnSM.marketPolyCache.marketPoly.polys) {
                if (OnSM.marketPolyCache.marketPoly.polys.hasOwnProperty(poly)) {
                    OnSM.marketPolyCache.marketPoly.polys[poly].setMap(null);
                }
            }
        }

        // Reset zoom and markers.
        if (OffSM.map !== null) {
            MapPage.resetZoomAndMarkers(true);
        }

        // Fade out blocks filters and fade in lots filters.
        // Bind the filter to the change event.
        $('.list_filter_lots').fadeIn();
        $('.list_filter_blocks').fadeOut();
        Filter.bindAmenitiesFilter(' .list_filter_lots select');

        // UI for legend. B/c it significantly different,
        // add some animation effect
        $('.legend').animate({'bottom': '-200px'});
        $('#legend-daily').animate({'bottom': '25px'});

        // This function can be called manually, so ensure the
        // write box is checked.
        $('.toggle_lots').prop('checked', true);

        // Make sure the markers are in 'Rates' mode
        MapPage.markerMode = 'rates';

        // Close infowindows
        this.closeAllInfoWindows();

        // Redraw map and record action
        PimUtil.recordAction('Toggle Layer', 'Lots');
        OffSM.refresh();
    };

    // Shows the onstreet layer
    this.showMeters = function () {
        // Don't reshow if already active.
        if (OnSM.active) {
            return;
        }

        // First activate and then de-active
        OnSM.active = true;
        OffSM.active = false;

        // Make sure the markers are in 'Occupancy' mode
        MapPage.markerMode = 'occupancy';

        // Close infowindows
        this.closeAllInfoWindows();

        // Fade out lots filters and fade in blocks filters.
        // Bind the filter to the change event and reset/refresh.
        $('.list_filter_lots').fadeOut();
        $('.list_filter_blocks').fadeIn();
        Filter.bindAmenitiesFilter(' .list_filter_blocks select');
        Filter.blocksFilter();

        // Redraw map and record action
        PimUtil.recordAction('Toggle Layer', 'Meters');
    };

    /** Centeralized infoWindow management.
     *
     * Can have a single infoWindow open at any given time.  This
     * manages:
     * - Closing the currently open window (if any) and calling the call
     *   back function it registered at info window creation time,
     * - Creating a new info window using
     *   - inContent to populate at,
     *   - marker as target for it, and
     *   - fullSize - there are two different sizes of infobubble
     *         small (used for hovers) and fullSize (used for details)
     *
     * @param {string} HTML content of the infoWindow
     * @param {google.maps.Marker} Marker associated with infoWindow
     * @param {function} Function that should be called when this
     * infoWindow is eventually closed.
     */
    this.openInfoWindow = function (inContent, marker, markerOptions) {
        var thisMap = this,
            defaultOptions;

        thisMap.closeAllInfoWindows();

        defaultOptions = {
            content: inContent,
            minWidth: 325,
            maxWidth: 280,
            arrowStyle: 2,
            arrowPosition: 50,
            arrowSize: 15,
            mapMarginTop: PimConfig.BUBBLE_MARGIN_TOP,
            hideCloseButton: true,
            padding: 0,
            shadowStyle: 3,
            disableAutoPan: true,
            disableAnimation: true,
            borderRadius: 3,
            yOffset: 5
        };

        markerOptions = $.extend({}, defaultOptions, markerOptions);

        this.infoWindow = new InfoBubble(markerOptions);
        this.infoWindow.open(MapPage.map, marker);

        // close function and event
        google.maps.event.addListener(this.infoWindow, 'closeclick', function () {
            thisMap.closeAllInfoWindows();
        });
    };

    /* Closes any infowindows open on the map */
    this.closeAllInfoWindows = function () {
        var infoWindow = this.infoWindow;

        // unfocus current pin
        // NOTE: Something about using the `Facility` class like this
        // bothers me, but still trying to sort out a better solution
        if (Facility.currentFocus !== null) {
            Facility.currentFocus.unfocus();
        }

        if (this.infoWindow !== null) {
            // need to set timeout to prevent race condition
            // in which animations for the infowindows were
            // overlapping with each other, prevent the first
            // window from closing
            window.setTimeout(function () {
                infoWindow.close();
            }, 50);
        }
    };

    /* Adds traffic and/or transit layers as defined in config */
    this.addTrafficTransitLayers = function () {
        var trafficLayer,
            transitLayer;

        if (PimConfig.configParams.traffic) {
            trafficLayer = new google.maps.TrafficLayer();
            trafficLayer.setMap(MapPage.map);
        }

        if (PimConfig.configParams.transit) {
            transitLayer = new google.maps.TransitLayer();
            transitLayer.setMap(MapPage.map);
        }
    };
};

MapPage.ppMap = null;

MapPage.idleEvent = null;

MapPage.customEvents = new CustomEvent();

MapPage.resetZoomAndMarkers = function (lots) {
    var mapType = lots ? OffSM : OnSM;

    // Force refesh of lots by zooming in
    // and showing the cached lots.
    mapType.map.setZoom(MapPage.mapCenter.z);
    if (Object.keys(mapType.cache).length) {
        $.each(mapType.cache, function () {
            this.marker.showMarker(true);
        });
    }
};

MapPage.clearMap = function () {

    // Update listeners attached to the map
    if (MapPage.idleEvent) {
        google.maps.event.removeListener(MapPage.idleEvent);
        MapPage.idleEvent = null;
    }
};

MapPage.changeStrokeWeight = function () {
    var zoom = OnSM.map.zoom;

    if (zoom < 16) {
        $.each(OnSM.cache, function () {
            this.marker.polygonsUpdate(2);
        });
    } else if (zoom > 15) {
        $.each(OnSM.cache, function () {
            this.marker.polygonsUpdate(4);
        });
    }
};

MapPage.initView = function () {
    var marker;

    if (!MapPage.ppMap) {
        MapPage.ppMap = new MapPage();
        MapPage.ppMap.initialize(MapPage.mapCenter.x, MapPage.mapCenter.y,
            MapPage.mapCenter.z, this);

        // Drop a pin on the lat/lng, unless it's a lot page.
        if (PimConfig.configParams.lat &&
            PimConfig.configParams.lng &&
            PimConfig.configParams.centerMarker) {
            marker = new google.maps.Marker({
                position:  MapPage.map.getCenter(),
                map: MapPage.map
            });
        }

        google.maps.event.addListener(MapPage.map, 'idle', function () {
            // If on the opboard lot details page,
            // remove the cookie. Otherwise the Google
            // map loads about half the time.
            if (PimConfig.MAP_TYPE === 'LOTPAGE' &&
                $('.opboard-nav').length) {
                $.removeCookie('parkme_mapcenter', { path: '/' });
            } else {
                MapPage.setCenterCookie();
            }
        });
    }

    MapPage.clearMap();
};

// Need to signal the map that the containing div has changed size.
MapPage.googleMapResize = function (headerHeight, mapWidth) {

    var mapHeight;

    // If not on a destination page,
    // adjust map height.
    if (PimConfig.MAP_TYPE !== 'DESTINATION' && PimConfig.MAP_TYPE !== 'LOTPAGE') {
        mapHeight = $(window).height() -
            headerHeight -
            $('#footer_row').outerHeight();
        $('#fullsize').height(mapHeight);
    }

    // Adjust map width but not for lotpage.
    if (PimConfig.MAP_TYPE !== 'LOTPAGE') {
        $('#fullsize').width(mapWidth);
    }

    // signal to google maps
    if (typeof MapPage !== 'undefined' && MapPage.map) {
        google.maps.event.trigger(MapPage.map, 'resize');
    }

    // resize height of panel and pagination
    if ($('#panel').length) {
        $('#panel').height(mapHeight);
        $('#results').height(mapHeight -
            $('.filter_padding:visible').outerHeight() - 20); // adsense offset
    }

    return mapHeight;
};

// Add listeners to call the resize function
MapPage.addResizeListeners = function () {
    window.onresize = function () {
        reSizeBody();
    };
};

/** Generated bounds corresponding to the viewport with padding.
 *
 * returns {Bounds} Bounds of the padded viewport.
 */
MapPage.getPaddedViewBounds = function () {
    return MapPage.getPercentBounds(PimConfig.DEFAULT_PADDED_VIEW_BOUNDS);
};

/* Adds a tile layer to the map */
MapPage.addTileOverlay = function (tileQuery, qs) {
    var tileLayerOverlay;

    qs = qs || '';

    tileLayerOverlay = new google.maps.ImageMapType({
        getTileUrl: function (coord, zoom) {
            return PimUtil.getVirtualHost('tile') +
                    tileQuery + zoom + '/' + coord.x + '/' + coord.y + qs;
        },
        tileSize: new google.maps.Size(256, 256),
        isPng: true,
        opacity: 0.75
    });
    MapPage.map.overlayMapTypes.push(tileLayerOverlay);
};


/** Generated bounds corresponding to the viewport with padding.
 *
 * returns {Bounds} Bounds of the padded viewport.
 */
MapPage.getPercentBounds = function (percent) {
    var center,
        bbox,
        sw,
        ne,
        newSW,
        newNE;

    bbox = MapPage.map.getBounds();
    sw = bbox.getSouthWest();
    ne = bbox.getNorthEast();
    center = bbox.getCenter();

    percent = 1 - percent;

    newSW = new google.maps.LatLng(
        sw.lat() - (sw.lat() - center.lat()) * percent,
        sw.lng() - (sw.lng() - center.lng()) * percent
    );

    newNE = new google.maps.LatLng(
        ne.lat() - (ne.lat() - center.lat()) * percent,
        ne.lng() - (ne.lng() - center.lng()) * percent
    );

    return new google.maps.LatLngBounds(newSW, newNE);
};

/** Determines if the window is mobile width
  * returns {bool}
  */
MapPage.mobileWidth = function () {
    return ($(window).width() <= PimConfig.WINDOW_WIDTH);
};

/* Changes style of Map  */
MapPage.changeStyle = function () {
    if (MapStyles.style === 'Basic') {
        MapStyles.darkStyle(MapPage.map);
        MapStyles.style = 'Dark';
    } else if (MapStyles.style === 'Dark') {
        MapStyles.silverStyle(MapPage.map);
        MapStyles.style = 'Silver';
    } else {
        MapStyles.mapStyles(MapPage.map);
        MapStyles.style = 'Basic';
    }
    $('#change-style-button').text(MapStyles.style);
}

/**
 * HACK: Override the InfoBubble function to place
 * the closebox farther inside the bubble.
 */
InfoBubble.prototype.positionCloseButton_ = function () {
    this.close_.style.right = this.px(10);
    this.close_.style.top = this.px(10);
};
;
/* global hex_md5, LAT, LONG, MapPage */

/* jshint browser:true, camelcase:false, devel:true, jquery:true */

(function () {
  'use strict';
}());

/** Configuration parameters used within PIM. */

var PimConfig = {};

PimConfig.MAP_TYPE = 'DESKTOP';

PimConfig.DEFAULT_OPTIONS = {

    // Display
    'hasTime': true,            // show time box
    'listView': true,           // turn-off the list view (only works on wider widgets)
    'header': true,             // show header
    'onlyPins': false,          // all pins (no bubbles)
    'infoBubble': true,         // show infobubbles
    'detailedBubble': false,    // show the big info bubble (in the widget)
    'hideRates': false,         // don't show rates in the info bubbles (in the widget)
    'searchPicker': false,      // for widget, toggle search instead of rate calc
    'ratePicker': false,        // for widget, should ratePicker be shown
    'sort': 'popular',          // Default sort option
    'scrollToZoom': true,       // Map zooms using scroll wheel
    'centerMarker': true,       // Show center marker

    // Filters
    'filter': 'daily',          // filter value for different map layers
    'lotFilter': '',            // only show specific lots
    'operator': null,           // operator
    'owner': null,              // owner

    // Development Tools
    'development': 'www',       // development
    'showOver': false,          // show over query
    'showBoundaries': false,    // for collision alogorithm, show boundaries

    // Rate Calc
    'entryTime': null,          // entry time (yyyy-mm-ddThh:mm)
    'duration': null,           // duration in minutes

    // Layers
    'traffic': false,           // adds traffic layer to widget/map
    'transit': false            // adds traffic layer to widget/map
};

// Set the bounding box (0.1 lat = 2.3 mile box)
PimConfig.BOUND_SIZE = 0.02;

// Set the margin for the bubble
PimConfig.BUBBLE_MARGIN_TOP = 5;

PimConfig.DEFAULT_PUB_ID = 'x09e4f$';

PimConfig.DEFAULT_CHK = 'bef@3oH!3e';

PimConfig.DEFAULTLAT = 34.048781;

PimConfig.DEFAULTLNG = -118.430246;

PimConfig.DEFAULTZOOM = 17;

PimConfig.DEFAULT_LIMIT = 75;

PimConfig.DEFAULT_PADDED_VIEW_BOUNDS = 2.5;

PimConfig.DEFAULT_OFFSET = 0;

PimConfig.DEFAULT_RATE_REQ = '';

PimConfig.PINS_TO_DRAW = 25;

// Sets the window width at which the webmap
// enters the mobile (phone/tablet) view
PimConfig.WINDOW_WIDTH = 736;


// Encoded with http://javascriptobfuscator.com/default.aspx
// This function returns either:
//      a hash of the value passed
//      or the current chk (if no value passed)
PimConfig.getCHK = function (value) {
    var _0x45c4 = ['\x63\x68\x6B', '\x67\x6C\x6F\x62\x61\x6C\x50\x61\x72\x61\x6D\x73',
            '\x44\x45\x46\x41\x55\x4C\x54\x5F\x43\x48\x4B'],
        chk = (this[_0x45c4[1]]()[_0x45c4[0]] === undefined) ? PimConfig[_0x45c4[2]]:this[_0x45c4[1]]()[_0x45c4[0]];
    if (value === undefined) {
        return chk;
    } else {
        return hex_md5(value + chk);
    }
};

PimConfig.configParams = {};

//set default global params
PimConfig.setDefaults = function () {

    var configParams = PimConfig.configParams;

    switch (PimConfig.MAP_TYPE) {

        case 'DESKTOP':

            // TODO: Hide DEFAULT_PUB_ID and DEFAULT_CHK within their accessor
            // functions.  This requires updating widget_specific.js to call this
            // accessor function if the queryParse fails.
            PimConfig.isWidget = false;                 // Used to determine if widget or mobile in code
            configParams.hasTime = false;               // Don't show timebox in upper right
            MapPage.markerMode = 'rates';               // Determines color schema (rates vs. occupancy)
            break;

        case 'MOBILE':

            configParams.hasTime = false;               // Don't show timebox in upper right
            PimConfig.DEFAULTZOOM = 16;                 // Default zoom for mobile is slightly higher
            PimConfig.isWidget = true;                  // Used to determine if widget or mobile in code
            PimConfig.BUBBLE_MARGIN_TOP = 15;           // keep from colliding with timebox
            break;

        case 'WIDGET':

            PimConfig.isWidget = true;                  // Used to determine if widget or mobile in code
            PimConfig.BUBBLE_MARGIN_TOP = 15;           // keep from colliding with timebox
            break;

        case 'DESTINATION':

            PimConfig.lat = LAT;                        // Set the lat from template variable
            PimConfig.lng = LONG;                       // Set the long from template variable
            PimConfig.DEFAULTZOOM = 14;                 // Default zoom for destinations are lower
            PimConfig.DEFAULT_LIMIT = 10;               // Limit to 10 lots per query
            PimConfig.DEFAULT_PADDED_VIEW_BOUNDS = 0.8; // Make padded view bounds smaller
            PimConfig.isWidget = true;                  // Used to determine if widget or mobile in code
            configParams.hasTime = false;               // Don't show timebox in upper right
            configParams.header = false;                // Don't show the header
            break;

        case 'LOTPAGE':

            PimConfig.lat = LAT;                        // Set the lat from template variable
            PimConfig.lng = LONG;                       // Set the long from template variable
            PimConfig.DEFAULTZOOM = 17;                 // Default zoom for destinations are lower
            configParams.hasTime = false;               // Don't show timebox in upper right
            configParams.header = false;                // Don't show the header
            configParams.infoBubble = false;            // No infoBubble
            configParams.scrollToZoom = false;          // Disable zoom with scroll wheel
            configParams.centerMarker = false;          // Don't show center marker
            break;
    }

    configParams.minzoom = 3;
    configParams.maxzoom = 20;
    configParams.showAll = false;

    return configParams;
};

// Copied from
// http://stackoverflow.com/questions/901115/how-can-i-get-query-string-values
PimConfig.queryParse = function () {
    var match,
        urlParams,
        pl,
        search,
        decode,
        query;

    urlParams = {};
    pl     = /\+/g;  // Regex for replacing addition symbol with a space
    search = /([^&=]+)=?([^&]*)/g;
    decode = function (s) { return decodeURIComponent(s.replace(pl, ' ')); };
    query  = window.location.search.substring(1);
    match = search.exec(query);

    while (match) {
        urlParams[decode(match[1])] = decode(match[2]);
        match = search.exec(query);
    }


    return urlParams;
};

var queryParse = PimConfig.queryParse();

//get config params
PimConfig.configParams = function () {

    var configParams = {},
        options;

    configParams = PimConfig.setDefaults();

    // configuration parameters and their default options
    options = PimConfig.DEFAULT_OPTIONS;

    // the following function works by
    //  overridding default values with queryParse values
    $.each(options, function (key, value) {
        // if value in querySet (GET parameters)
        if (queryParse[key] !== undefined) {
            // if boolean, convert from boolean
            if (value === true || value === false) {
                configParams[key] = (queryParse[key].toLowerCase() === 'true');
            // if not, pass the exact value
            } else {
                configParams[key] = queryParse[key];
            }
        // else set to default
        } else if (configParams[key] === undefined) {
            configParams[key] = value;
        }
    });

    // accept mulitple options types here
    configParams.lot =  PimConfig.lot || queryParse.lot;
    configParams.meter =  PimConfig.meter || queryParse.meter;
    configParams.lot_alias =  PimConfig.lot_alias || queryParse.lot_alias;
    configParams.lat =  parseFloat(PimConfig.lat || queryParse.lat);
    configParams.lng =  parseFloat(PimConfig.lng || queryParse.lng || queryParse.long || queryParse.lon);
    configParams.zoom = parseInt(PimConfig.zoom || queryParse.zoom || queryParse.z, 10);
    configParams.s =    PimConfig.s || queryParse.s || queryParse.q;
    configParams.lotFilter = PimConfig.lotFilter || queryParse.lotFilter;

    return configParams;
};

//get global params
PimConfig.globalParams = function () {

    var globalParams = {},
        i,
        options;

    //other options
    globalParams.pub_id = PimConfig.DEFAULT_PUB_ID;
    globalParams.chk = PimConfig.DEFAULT_CHK;
    globalParams.limit = PimConfig.DEFAULT_LIMIT;
    globalParams.offset = PimConfig.DEFAULT_OFFSET;
    globalParams.rate_request = PimConfig.DEFAULT_RATE_REQ;
    globalParams.paddedViewBounds = PimConfig.DEFAULT_PADDED_VIEW_BOUNDS;

    // get the string options from the query string
    options =
        ['operator', 'owner'];

    for (i = 0; i < options.length; i += 1) {
        if (queryParse[options[i]] !== undefined) {
            globalParams[options[i]] = queryParse[options[i]];
        }
    }

    if (PimConfig.configParams.operator) {
        globalParams.operator = PimConfig.configParams.operator;
    }

    return globalParams;
};
;
/* global $, MapPage, PimConfig, window, Search */

/* jshint browser:true, camelcase:false, devel:true, jquery:true */

'use strict';

// Sets the cookie plugin to use JSON
$.cookie.json = true;

if (typeof MapPage === 'undefined') {
    var MapPage = {};
}

MapPage.updateMapFromUrl = function () {
    var target,
        triggerGeolocator = false,
        mapContainer = document.getElementById('fullsize');

    PimConfig.configParams = PimConfig.configParams();
    MapPage.mapCenter = MapPage.getMapCenter();

    // Required (aka citypages)
    if (PimConfig.REQUIREDLAT && PimConfig.REQUIREDLNG) {

        MapPage.mapCenter.x = PimConfig.REQUIREDLAT;
        MapPage.mapCenter.y = PimConfig.REQUIREDLNG;
        MapPage.mapCenter.z = 15;

    // Hash Tag
    } else if (window.location.hash && $.trim(window.location.hash.substring(1)) !== '' &&
        PimConfig.MAP_TYPE !== 'LOTPAGE') {

        // Facebook redirect appends this for no reason
        // There is an open issue in django-social-auth
        // Patch is documented here
        //stackoverflow.com/questions/7131909/facebook-callback-appends-to-return-url
        if (window.location.hash === '#_=_') {
            window.location.hash = '';
            MapPage.updateMapFromUrl(); // call recursive with corrected hash
            return;
        }

        target = decodeURIComponent(window.location.hash.substring(1));

        if (typeof Search !== 'undefined') {
            Search.doLocSearch(target, function (resultLocation) {
                // Set the lat and long and then rerun this function
                PimConfig.REQUIREDLAT = resultLocation.lat();
                PimConfig.REQUIREDLNG = resultLocation.lng();
                MapPage.updateMapFromUrl();
            });
        }
        return;

    // Search Param
    } else if (PimConfig.configParams.s) {

        target = decodeURIComponent(PimConfig.configParams.s).replace('+', ' ');
        Search.doLocSearch(target, function (resultLocation) {
            // Set the lat and long and then rerun this function
            PimConfig.REQUIREDLAT = resultLocation.lat();
            PimConfig.REQUIREDLNG = resultLocation.lng();
            MapPage.updateMapFromUrl();
        });
        return;

    // Location (lat/lng) param
    } else if (PimConfig.configParams.lat && PimConfig.configParams.lng) {
        if (Math.abs(PimConfig.configParams.lat) < 90 &&
                Math.abs(PimConfig.configParams.lng) < 180) {

            MapPage.mapCenter.x = PimConfig.configParams.lat;
            MapPage.mapCenter.y = PimConfig.configParams.lng;
        }

    // Set map center using URL stored center.
    // If it wasn't already set by the querystring above
    } else {
        // Fire off geolocator
        // if there no other parameters (meter/lot/lot_alias)
        if (!PimConfig.configParams.meter &&
            !PimConfig.configParams.lot && !PimConfig.configParams.lot_alias) {
            triggerGeolocator = true;
        }
    }

    // Calculate zoom
    if (PimConfig.configParams.zoom &&
            PimConfig.configParams.zoom >= 1 &&
            PimConfig.configParams.zoom <= 20) {
        MapPage.mapCenter.z = parseInt(PimConfig.configParams.zoom, 10);
    } else {
        MapPage.mapCenter.z = MapPage.mapCenter.z || PimConfig.DEFAULTZOOM;
    }

    if (mapContainer) {
        MapPage.initView();
    }

    // Fire off geolocator, if available
    //   -- we put this at the end to prevent race condition
    //   where geolocates before map load
    if (triggerGeolocator && MapPage.geolocator) {
        MapPage.geolocator.getLocation();
    }
};

$(document).ready(function () {
    try {
        MapPage.updateMapFromUrl();
    } catch (e) {}
});

// Checks for cookie if not,
MapPage.getMapCenter = function () {
    var mapCenter;

    try {
        mapCenter = $.cookie('parkme_mapcenter');
    } finally {
        if (!mapCenter) {
            mapCenter = {
                x: PimConfig.DEFAULTLAT,
                y: PimConfig.DEFAULTLNG,
                z: PimConfig.DEFAULTZOOM
            };
        }
    }
    return mapCenter;
};

MapPage.getCenterLatLng = function (center) {
    return {
        lat: center.lat(),
        lng: center.lng()
    };
};

MapPage.setCenterCookie = function () {
    var configurations,
        center,
        mapCenter,
        zoom,
        lat,
        lng;

    configurations = {
        path: '/',      // set globally for the site
        expires: 31     // one month expiration
    };

    center = MapPage.map.getCenter();

    lat = MapPage.getCenterLatLng(center).lat;
    lng = MapPage.getCenterLatLng(center).lng;

    zoom = MapPage.map.getZoom();
    mapCenter = {x: lat, y: lng, z: zoom};
    $.cookie.json = true;
    $.cookie('parkme_mapcenter', mapCenter, configurations);
};
;
/* global log, MapPage, PimConfig, PimUtil, DatePair, OffSM, gettext, ngettext,
    datePickerLocale */

/* jshint browser:true, camelcase:false, devel:true, jquery:true */


var TimeSlider = function () {

    var filter;

    // initial datetime
    this.tzAbbrev = '';
    this.offset = new Date().getTimezoneOffset() * -60;

    // Extend the DatePair options if they exist.
    // Example: locale, set in the base template.
    if (typeof(datePickerLocale) !== 'undefined') {
        $.extend(DatePair.datePickerOptions, datePickerLocale);
    }

    this.datePair = new DatePair(false);

    // whether or not a duration has been selected
    this.duration = 60;

    this.initialize = function () {

        var thisSlider = this,
            thisEntryDate;

        // cache all filter buttons for later use
        var filterBtns = {
            dailyBtn: $('.daily-btn'),
            monthlyBtn: $('.monthly-btn'),
            resBtn: $('.res-btn'),
            streetBtn: $('.street-btn'),
            durationBtn: $('#filterTimeSelect'),
            monthDurBtn: $('#monthly-duration-btn')
        };

        // form/link urls for processing /?next= links
        var urls = {
            loginUrl: $('.header-log-in').attr('href'),
            logoutUrl: $('.header-sign-out').attr('href'),
            signupUrl: $('.header-sign-up').attr('href')
        };

        // Get filter from url
        var urlFilter = PimConfig.queryParse();

        // Bind the filter btn and run the function based on type.
        this.bindFilterBtns(filterBtns, urls, thisSlider);

        // Make sure filter is run first time
        if (urlFilter.filter !== undefined) {
            PimConfig.configParams.filter = '';
        }

        // Process incoming url, and change active filter btns accordingly
        thisSlider.runFilterFunctions(filterBtns, urls, urlFilter.filter, null, true);

        // Trigger a time change/even record when
        // duration Done btn is clicked
        $('#time-change-submit').on('click', function () {
            thisSlider.changeTime();
            thisSlider.recordEvent();
        });

        // Redraw the list/map on the destination page widget.
        if (PimConfig.MAP_TYPE === 'DESTINATION') {
            $('.dt_date_start, .dt_time_start, .dt_date_end, .dt_time_end')
                .change(function () {
                    thisSlider.changeTime();
                    thisSlider.recordEvent();
            });
        }

        // Initialize button set
        if ($('.radio_buttons').length) {
            $('.radio_buttons').buttonset();
        }

        // Listen for search events
        MapPage.customEvents.addEventlistener('search_event', function () {
            MapPage.ppMap.closeAllInfoWindows();
            thisSlider.recordEvent();
        });

        // Update start time
        // See ranking by priority below
        // 1.) GET Paramter passed to widget or map view
        // 2.) Default to nearest half hour
        if (PimConfig.configParams.entryTime) {
            thisEntryDate = Date.fromISO(PimConfig.configParams.entryTime);
            if (!isNaN(thisEntryDate.getTime())) {
                this.datePair.setStartDateTime(thisEntryDate);
                this.datePair.updateEndTime(this.duration * 60);
                this.changeTime();
            } else {
                log.error('Invalid input start time');
                this.datePair.setStartDateTime(new Date());
                this.changeTime();
            }
        } else {
            this.startTime = new Date();
            this.datePair.setStartDateTime(this.startTime);
        }

        // Update duration
        // See ranking by priority below
        // 1.) GET Paramter passed to widget or map view
        // 3.) Default to 60 minutes
        if (PimConfig.configParams.duration) {
            if (!isNaN(PimConfig.configParams.duration)) {
                this.duration = PimConfig.configParams.duration;
            } else {
                log.error('Invalid input duration');
            }
            this.datePair.updateEndTime(this.duration * 60);
            this.changeTime();
        } else {
            this.datePair.updateEndTime(this.duration * 60);
        }

        // Update daily monthly based on GET parameters
        if (PimConfig.configParams.filter === 'monthly') {
            this.monthlyUIChanges();
        }

        // on the webmap, you need to click "Search" to fire off a rate calc
        // but on the widget, you just need to change the time
        if (PimConfig.isWidget) {
            $('.dt_date_start, .dt_time_start, .dt_date_end, .dt_time_end').change(function () {
                MapPage.customEvents.dispatch('search_event');
            });
        }

        this.changeFilterBtn(null);

        // On hash change, run fuction that sets
        // filter btn css and route-back urls
        $(window).on('hashchange', function () {
            thisSlider.runFilterFunctions(filterBtns, urls, PimConfig.configParams.filter, null);
        });
    };

    this.bindFilterBtns = function (filterBtns, urls, thisSlider) {
        // Bind the filter btn and run the function based on type.
        $('.filter-btn').click(function () {
            var btnClass;

            if ($(this).hasClass('daily-btn')) {
                btnClass = 'daily';
            } else if ($(this).hasClass('monthly-btn')) {
                btnClass = 'monthly';
            } else if ($(this).hasClass('res-btn')) {
                btnClass = 'reserve';
            } else if ($(this).hasClass('street-btn')) {
                btnClass = 'street';
            }

            thisSlider.runFilterFunctions(filterBtns, urls, btnClass, $(this));
        });
    };

    // Switches filter on incoming urls and btn clicks
    this.runFilterFunctions = function (filterBtns, urls, filter, thisBtn, init) {
        if (filter !== undefined && filter !== PimConfig.configParams.filter) {
            PimConfig.configParams.filter = filter;
            switch (filter) {
            case 'daily':
                MapPage.ppMap.showLots();
                this.dailyRates(filterBtns.dailyBtn, init);

                // set ?next params
                this.processUrls('daily', urls);

                // style buttons (active/disabled)
                this.changeFilterBtn(filter);

                // Hide normal duration btn; show monthly
                filterBtns.durationBtn.show();
                filterBtns.monthDurBtn.hide();
                break;
            case 'monthly':
                MapPage.ppMap.showLots();
                this.monthlyRates(filterBtns.monthlyBtn);

                // set ?next params
                this.processUrls('monthly', urls);

                // style buttons (active/disabled)
                this.changeFilterBtn(filter);

                // Hide normal duration btn; show monthly
                filterBtns.durationBtn.hide();
                filterBtns.monthDurBtn.show();
                break;
            case 'reserve':
                MapPage.ppMap.showLots();
                this.guaranteed(filterBtns.resBtn, init);

                // set ?next params
                this.processUrls('reserve', urls);

                // style buttons (active/disabled)
                this.changeFilterBtn(filter);

                // Hide normal duration btn; show monthly
                filterBtns.durationBtn.show();
                filterBtns.monthDurBtn.hide();
                break;
            case 'street':
                MapPage.ppMap.showMeters();

                // Enable datepickers
                this.datePair.enable();

                // set ?next params
                this.processUrls('street', urls);

                // style buttons (active/disabled)
                this.changeFilterBtn(filter);

                // Hide normal duration btn; show monthly
                filterBtns.durationBtn.show();
                filterBtns.monthDurBtn.hide();
                break;
            }
        }
    };

    // Sets the selected button to "active" state;
    // removes active state from other filter btns
    this.changeFilterBtn = function (filter) {
        // Closes info windows.
        MapPage.ppMap.closeAllInfoWindows();

        if (!filter) {
            return;
        }

        // Adds/removes active state from all
        // layer btns of the same class.
        $('.filter-btn-active').not($('.filter-full-width')).removeClass('filter-btn-active');
        if (filter === 'daily') {
            $('.daily-btn').addClass('filter-btn-active');
        } else if (filter === 'reserve') {
            $('.res-btn').addClass('filter-btn-active');
        } else if (filter === 'monthly') {
            $('.monthly-btn').addClass('filter-btn-active');
        } else if (filter === 'street') {
            $('.street-btn').addClass('filter-btn-active');
        }
    };

    // check which button is pressed and assign urls accordingly (for round trip);
    this.processUrls = function (filter, urls) {
        $('.header-log-in').attr('href',  urls.loginUrl + encodeURIComponent('map?filter=' + filter));
        $('.header-sign-out').attr('href',  urls.logoutUrl + encodeURIComponent('map?filter=' + filter));
        $('.header-sign-up').attr('href',  urls.signupUrl + encodeURIComponent('map?filter=' + filter));
    };

    // Quick Rates (1hr, 2hr, etc.) buttons
    this.quickRates = function (duration) {
        // Closes info windows.
        MapPage.ppMap.closeAllInfoWindows();

        this.duration = duration;
        this.datePair.updateEndTime(this.duration * 60);

        // Update time strings and send ajax
        this.changeTime();
        this.recordEvent();

        // Hide duration box (widget)
        $('#duration_drop_down').hide();

        // Google Analytics
        PimUtil.recordAction('Quick Rate', duration);
    };

    // runs the bulk of the daily/guaranteed functionality
    this.dailyGuar = function (thisFunction, filter, init) {
        // re-bind tooltip
        $('.filter-btn').tooltip();

        // Because daily/monthly are similar, there doesn't have to be UI
        // Just we can just css change the legend
        $('.legend').css('bottom', '-200px');
        $('#legend-daily').css('bottom', '25px');

        // Enable occupancy selector
        $('.select_occupancy').fadeTo('fast', 1);

        // Enable datepickers
        thisFunction.datePair.enable();

        // Modify the DOM to re-add filters
        $('.filter_datetime').show('blind', {}, 500);

        // set configParams.filter to filter string
        PimConfig.configParams.filter = filter;

        // Google Analytics
        if (filter !== 'reserve') {
            PimUtil.recordAction('Daily Monthly', 'Daily');
        } else {
            PimUtil.recordAction('Daily Monthly', 'Guaranteed');
        }

        // Dispatch a change event if not the initial call.
        if (!init) {
            thisFunction.changeTime();
        }

        MapPage.customEvents.dispatch('duration_change');
    };

    // Daily Rates button
    this.dailyRates = function (thisBtn, init) {
        // set guaranteed status to false
        filter = 'daily';

        // if filter is already daily, do nothing
        if (PimConfig.configParams.filter === 'daily') {
            return;
        }

        this.dailyGuar(this, filter, init);
    };

    // Guaranteed button
    this.guaranteed = function (thisBtn, init) {
        // set guaranteed status to false
        filter = 'reserve';

        // if filter is already reserve, do nothing
        if (PimConfig.configParams.filter === 'reserve') {
            return;
        }

        this.dailyGuar(this, filter, init);
    };

    // Monthly Rates button
    this.monthlyRates = function () {

        // if filter is already monthly, do nothing
        if (PimConfig.configParams.filter === 'monthly') {
            return;
        }

        // set configParams.filter to monthly
        PimConfig.configParams.filter = 'monthly';

        // Make UI / DOM related changes
        this.monthlyUIChanges();

        // Google Analytics
        PimUtil.recordAction('Daily Monthly', 'Monthly');

        // Disable on- and off-street selector.  Force off-street view.
        // TODO: I wish there was a way to avoid using OffSM here
        if (OffSM.active) {
            MapPage.customEvents.dispatch('duration_change');
        }
    };

    // Just the UI changes related to monthly
    // Seperated from the Monthly Rates function so it can be
    //  called without triggering a larger refresh
    this.monthlyUIChanges = function () {

        // Because daily/monthly are similar, there doesn't have to be UI
        // Just we can just css change the legend
        $('.legend').css('bottom', '-200px');
        $('#legend-monthly').css('bottom', '25px');

        // Disable occupancy selector
        $('.select_occupancy').fadeTo('fast', 0.5);

        // Disable datepickers
        this.datePair.disable();

        // Modify the DOM to remove filters and add text
        $('.filter_datetime').hide();

    };

    // Affect all the change time liseteners
    this.changeTime = function () {
        var days,
            hours,
            minutes;

        // Update module state
        this.startTime = this.datePair.getStartDateTime();

        this.duration = Math.ceil(this.datePair.getTimeDelta() / 60);

        // Add duration to the ParkMe algorithm so it will show when
        // list view is populated.
        days = Math.floor(this.duration / 1440);
        hours = Math.floor((this.duration % 1440) / 60);
        minutes = this.duration % 60;
        TimeSlider.formattedDuration = TimeSlider.formatDuration(days, hours, minutes, PimConfig.configParams.filter);

        // insert hours/mins into duration btn and modal time text
        $('#filterTimeSelect .filter-rate-text, .output-duration').text(TimeSlider.formattedDuration);

        // TimeBox (with timezone)
        $('.duration_output').text(TimeSlider.formattedDuration);
        if (PimConfig.isWidget) {
            $('.time_output').text(
                this.datePair.startDate.val() +
                ' ' + this.datePair.startTime.val() +
                ' ' + this.tzAbbrev);
            $('.show_rates').show();
        }

        // If monthly, don't record time change
        // Maybe it would be nice to combine the monthly and changeTime analytics?
        if (PimConfig.configParams.filter === 'monthly') {
            return;
        }

        // Fire of event alerting world of time change
        MapPage.customEvents.dispatch('duration_change');

        // Adds selected lot time to purchase details
        $('.arrive-time').text(this.datePair.startTime.val());
        $('.depart-time').text(this.datePair.endTime.val());
    };

    // Record time change event
    this.recordEvent = function () {
        var timeString = this.startTime.getHours() + ':' + this.startTime.getMinutes();
        PimUtil.recordAction('Time Change',
                ' Duration: ' + this.duration +
                ' EntryTime: ' + timeString);
    };

    // Update the TZ when it is received from the API
    this.updateTimeZone = function (response) {

        var offsetDifference,
            timeWithOffset,
            originalTimeDelta;

        // check if the timelider exists, region data exits,
        //    and if region data is new
        // update slider timezone
        if (response.result.length && response.result[0].offset && this.tzAbbrev !== response.result[0].offset) {

            // compute the difference between old and new offsets
            offsetDifference = this.offset - response.result[0].offset;

            // update timezone and offset
            //this.tzAbbrev = response.RegionData.abbrev;
            this.offset = response.result[0].offset;

            // Set time to local time minus the offset of
            // the geography time of view
            // If user is browsing in the same timezone as the map
            // they are searching in, do not update time
            // This references GitHub issue #2650
            if (offsetDifference !== 0) {
                originalTimeDelta = this.datePair.getTimeDelta();
                timeWithOffset = new Date(
                        this.datePair.getStartDateTime() - (offsetDifference) * 1000);
                this.datePair.setStartDateTime(timeWithOffset);
                this.datePair.updateEndTime(originalTimeDelta);
                this.changeTime();
            }
        }
    };

    // constructor
    (function (thisTimeSlider) {
        thisTimeSlider.initialize();
    }(this));

};

// Populated by TimeSlider.js or other time-related library
TimeSlider.formattedDuration = '';

TimeSlider.nearestHalfHour = function (now) {
    var interval = 30,
        mins = now.getMinutes(),
        halfHours = Math.ceil(mins / interval);

    if (halfHours === (60 / interval)) {
        now.setHours(now.getHours() + 1);
    }
    mins = (halfHours * interval) % 60;
    now.setMinutes(mins);
    return now;
};

/** Formats duration in minutes to string.
 *
 * @param {number} Integer number of minutes.
 * @returns {string} Formated duration in an easy to read human form.
 */
TimeSlider.formatDuration = function (days, hours, minutes, filter) {

    // Special case for monthly
    if (filter === 'monthly' || filter === 'L') {
        return '1 ' + gettext('month');
    }
    // Special case for NaN
    else if (isNaN(days) || isNaN(hours) || isNaN(minutes)) {
        return '';
    }

    // Hours
    if (hours === 0) {
        hours = '';
    } else if (days === 0 && minutes === 0) {
        hours = hours + ' ' + ngettext('hour', 'hours', hours);
    } else {
        hours = hours + ' ' + ngettext('hr', 'hrs', hours);
    }

    // Minutes
    if (minutes === 0 || (hours && days)) {
        minutes = '';
    } else {
        minutes = minutes + ' ' + gettext('min');
    }

    // Days
    if (days === 0) {
        days = '';
    } else {
        days = days + ' ' + ngettext('day', 'days', days);
    }

    // Spacing between items
    if (hours) {
        hours = (days) ? ' ' + hours : hours;
    }
    if (minutes) {
        minutes = (hours || days) ? ' ' + minutes : minutes;
    }

    return days + hours + minutes;
};

// Hook ourselves into the Init
// Checking if MapPage exists for use
// on the quote page confirmation.
if (typeof MapPage !== 'undefined') {
    TimeSlider.TimeSliderInitView = MapPage.initView;
    MapPage.initView = function () {
        TimeSlider.TimeSliderInitView();

        MapPage.timeSlider = new TimeSlider();
    };
}
;
/* global google, log, MapPage, PimUtil, PimConfig, OffSM, OnSM */

/* jshint browser:true, camelcase:false, devel:true, jquery:true */

(function () {
  'use strict';
}());

MapPage.searchMarker = null;

var Search = {};

Search.init = function () {

    // Configure search elements if they are present in the page.
    //
    // Looks for a "searchButton" button and a "searchLoc" input.  If
    // both elements are well defined then configure them for search.
    // Else search must be performed by calling Search.doLocSearch
    // directly.

    $( '#search-form' ).submit(function(event) {
        // If on a city or destination page, use the
        // form search rather than the hash change.
        if (event.target.parentElement.parentElement.parentElement
            .parentElement.parentElement.className !== 'citypage-nav') {
            event.preventDefault();
            Search.masterSearch();
        }
    });
};

// Hash Change Event
$(window).bind('hashchange', function () {
    Search.doLocSearch(decodeURIComponent(window.location.hash.substring(1)));
});

Search.hasGeocodeFailure = function (status) {
    if (status === google.maps.GeocoderStatus.ZERO_RESULTS) {
        console.log('Couldn\'t locate anything for that. :(');
        return true;
    }
    if (status !== google.maps.GeocoderStatus.OK) {
        log.info('Geocode fail: ' + status);
        return true;
    }
    return false;
};

Search.masterSearch = function () {
    var searchInput;

    // There might be multiple inputs depending on the
    //  modal, etc..  Get the value of the first non-blank
    $('#searchLoc').each(function () {
        searchInput = $(this).val();
        if (searchInput && searchInput !== 'Where are you going?') { // IE placeholder bug
            // set the hash, this triggers a doLocSearch event
            window.location.hash = encodeURIComponent(searchInput);
            PimUtil.recordAction('Search', searchInput);  // update analytics
            return false;  // break out of fuction (false = stop)
        }
    });

    MapPage.customEvents.dispatch('search_event');
};

Search.doLocSearch = function (target, callback) {
    var service,
        request,
        geoSearch,
        locationSearch,
        isMSIE;

    // don't search if no target
    if (!target) {
        log.error('Target does not exist!');
        return;
    }

    // Hide the search box if necessary (widget)
    $('#search_drop_down').hide();

    if (isMobile.any()) {
        // Hide some mobile search stuff
        $('#search-form, #clear-search').hide();
        $('#searchLoc').hide();
        $('#header_fullsize').removeClass('nav-search-mode');
        $('.logo-mobile').removeClass('logo-hidden');
        $('#search-overlay').hide();
    }

    // Hide the lot page if necessary
    $('#lot_page_container').hide();

    geoSearch = function (target) {
        // If Local search fails, then we try a global serach
        // with Google Geocoder
        request = {
            address: target,
            region: 'us'
        };

        service = new google.maps.Geocoder();
        service.geocode(request, function (results, status) {
            if (Search.hasGeocodeFailure(status)) {
                log.info('Search failed with status: ' + status);
                return;
            }

            log.info('Geocoder results found for: ' + target);
            Search.setResultLocation(target, results[0], callback);
            return;
        });
    };

    locationSearch = function (target) {
        // First we try and get the Google Local
        // results for the maps local parameters
        request = {
            query: target,
            location: MapPage.map.getCenter(),
            radius: '50000'  // max radius or bounds accepted
        };

        service = new google.maps.places.PlacesService(MapPage.map);
        service.textSearch(request, function (results, status) {
            if (status === google.maps.places.PlacesServiceStatus.OK) {
                log.info('Autocomplete results found for: ' + target);
                Search.setResultLocation(target, results[0], callback);
                return;
            }

            geoSearch(target);
        });
    };

    // Google Places does not support versions of
    // IE before IE9.  This is a hack to test for
    // and not run Places for older versions
    isMSIE = /*@cc_on!@*/0;

    if (!MapPage.map) {
        geoSearch(target);
    } else {
        locationSearch(target);
    }

};

Search.setResultLocation = function (target, result, callback) {

    var resultLocation = result.geometry.location;

    // Special Callback Logic
    // If a callback is provided, then use that logic instead of setResult logic
    if (callback) {
        return callback(resultLocation);
    }

    // set center
    // close windows and set the search zoom
    MapPage.map.setCenter(resultLocation);
    MapPage.ppMap.closeAllInfoWindows();
    MapPage.map.setZoom(15);

    // There's two problems which I'm attempting to fix here
    //   1. Cache and memory build up over time and can get a little heavy
    //         after extended use
    //   2. Without knowing if has_loaded and if ajax in_flight.. I'm not sure
    //         when to display the "no lots found" modal.
    //
    OffSM.resetManager();
    OnSM.resetManager();

    // save city information
    if (result.address_components) {
        $.each(result.address_components, function () {
            if (this.types[0] === 'locality') {
                MapPage.city = this.short_name;
                return false;
            }
        });
    }

    // remove old search marker and add new one
    if (MapPage.searchMarker) {
        MapPage.searchMarker.setMap(null);
    }
    MapPage.searchMarker = new google.maps.Marker({
        position: resultLocation,
        title: target
    });
    MapPage.searchMarker.setMap(MapPage.map);
};

// Hook ourselves into the Init
Search.SearchInitView = MapPage.initView;
MapPage.initView = function () {
    Search.SearchInitView();
    Search.init();
};

// Overload the clear map function
Search.MapPageClearMap = MapPage.clearMap;
MapPage.clearMap = function () {
    Search.MapPageClearMap();
    if (MapPage.searchMarker) {
        MapPage.searchMarker.setMap(null);
    }
};
;
/*jslint jquery:true, browser:true, nomen:true, regexp:true, camelcase:false */

'use strict';

var PimUtil = {};

// Override these if you need different functionality
PimUtil.getVirtualHost = function (baseHostname) {
    var NEW_HOST = window.location.protocol + '//' + baseHostname + '.parkme.com';
    if (typeof PimUtil !== 'undefined') {
        return PimUtil.updateVirtualHost(baseHostname);
    }

    return NEW_HOST;
};

PimUtil.updateVirtualHost = function (newName) {
    var serverParts,
        pathParts;

    if (newName === undefined) {
        return window.location.protocol + '//' + window.location.hostname;
    }

    serverParts = window.location.hostname.split('.');
    pathParts = window.location.pathname.split('\/');

    if (serverParts.length === 2) {
        // Accessed directly via parkme.com with no app name.
        serverParts[0] = newName;
    } else if (serverParts.length === 3 && (
            serverParts[0].search('dev') === 0 ||
            serverParts[0].search('app') === 0 ||
            serverParts[0].search('stg') === 0 ||
            serverParts[0].search('beta') === 0 ||
            serverParts[0].search('demo') === 0
        )) {
        // Accessed via release branch of development server with no app
        // name (ie: dev1.parkme.com).
        serverParts.splice(0, 0, newName);
    } else if (serverParts.length === 3) {
        // Accessed via release branch of production server with an app
        // name (ie: map.parkme.com).
        serverParts[0] = newName;
    } else if (serverParts.length === 4 && (
            serverParts[1].search('dev') === 0 ||
            serverParts[1].search('app') === 0 ||
            serverParts[1].search('stg') === 0 ||
            serverParts[1].search('beta') === 0 ||
            serverParts[1].search('demo') === 0
        )) {
        // Accessed via release branch of development server with an app
        // name (ie: map.dev1.parkme.com).
        serverParts[0] = newName;
    } else {
        // If request is coming in from an unknown location, as is the
        // case when an external company were using this code, then
        // default to parkme.com with the newName
        // prepended.
        return window.location.protocol + '//'  + newName + '.parkme.com';
    }

    return window.location.protocol + '//' + serverParts.join('.') + ':' + window.location.port;
};

PimUtil.recordAction = function (action, label) {
    /*jslint nomen: true */
    /*global ga */

    //_trackEvent(category, action, opt_label, opt_value)
    ga('send', 'event', 'Action', action, label);
};

// Function pauses the browser
//(sync Sleep vs. async setTimeout)
PimUtil.sleep = function (millis) {
    var date = new Date(),
        curDate = null;
    do {
        curDate = new Date();
    } while (curDate - date < millis);
};

// Returns a string in format similar to ISO8601 form.
// But in local time.  Used to for rate calc
PimUtil.ISODateFormat = function (date) {
    var day,
        hour,
        minute,
        month,
        year;

    try {

        // NOTE: Passing through the Date object is a simple way to parse the
        // time into a good wire format.  Note that the time is
        // intended to be the local time at the lot.
        month = date.getMonth() + 1;
        month = (month < 10 ? '0' : '') + month; //force two digit month
        day = (date.getDate() < 10 ? '0' : '') + date.getDate();          //force two digit date
        year = date.getFullYear();

        hour = (date.getHours() < 10 ? '0' : '') + date.getHours();
        minute = (date.getMinutes() < 10 ? '0' : '') + date.getMinutes();

        //2012-03-05T19:35
        return year + '-' + month + '-' + day + 'T' + hour + ':' + minute;

    } catch (e) {
        return;
    }
};

// Function to be used for polyline decoding that allows for optional precision argument
PimUtil.decodePolyline = function (str, precision) {
    var index = 0,
        lat = 0,
        lng = 0,
        coordinates = [],
        shift = 0,
        result = 0,
        byte = null,
        latitude_change,
        longitude_change,
        factor = Math.pow(10, precision || 5);

    // Coordinates have variable length when encoded, so just keep
    // track of whether we've hit the end of the string. In each
    // loop iteration, a single coordinate is decoded.
    while (index < str.length) {

        // Reset shift, result, and byte
        byte = null;
        shift = 0;
        result = 0;

        do {
            byte = str.charCodeAt(index++) - 63;
            result |= (byte & 0x1f) << shift;
            shift += 5;
        } while (byte >= 0x20);

        latitude_change = ((result & 1) ? ~(result >> 1) : (result >> 1));

        shift = result = 0;

        do {
            byte = str.charCodeAt(index++) - 63;
            result |= (byte & 0x1f) << shift;
            shift += 5;
        } while (byte >= 0x20);

        longitude_change = ((result & 1) ? ~(result >> 1) : (result >> 1));

        lat += latitude_change;
        lng += longitude_change;

        coordinates.push([lat / factor, lng / factor]);
    }

    return coordinates;
};

// Creates a Date.fromISO function that converts a string to new Date()
//  Used to fix a bug with <IE8
//  http://stackoverflow.com/questions/11020658/javascript-json-date-parse-in-ie7-ie8-returns-nan
(function () {
    var D = new Date('2011-06-02T09:34:29+02:00');
    if (!D || +D !== 1307000069000) {
        Date.fromISO = function (s) {
            var day, tz,
            rx = /^(\d{4}\-\d\d\-\d\d([tT ][\d:\.]*)?)([zZ]|([+\-])(\d\d):(\d\d))?$/,
            p = rx.exec(s) || [];
            if (p[1]) {
                day = p[1].split(/\D/);
                for (var i = 0, L = day.length; i < L; i += 1) {
                    day[i] = parseInt(day[i], 10) || 0;
                }
                day[1] -= 1;
                day = new Date(Date.UTC.apply(Date, day));
                if (!day.getDate()) {
                    return NaN;
                }
                if (p[5]) {
                    tz = (parseInt(p[5], 10) * 60);
                    if (p[6]) {
                        tz += parseInt(p[6], 10);
                    }
                    if (p[4] === '+') {
                        tz *= -1;
                    }
                    if (tz) {
                        day.setUTCMinutes(day.getUTCMinutes() + tz);
                    }
                }
                return day;
            }
            return NaN;
        };
    } else {
        Date.fromISO = function (s) {
            return new Date(s);
        };
    }
})();
;
/* Global Mobile Link Tracking */

// Attaches a click event to all mobile links on a document
// Requires that Google Analytics, Universal Analytics, and MixPanel are included

/* global ga */

/* jshint browser: true, camelcase: false, devel:true, jquery:true, nomen: true */

(function () {
  'use strict';
}());


var mobileTrack = {};

mobileTrack.iPhoneLink = 'http://itunes.apple.com/app/p-i-m/id417605484';
mobileTrack.androidLink = 'https://play.google.com/store/apps/details?id=com.parkme.consumer';
mobileTrack.windowsPhoneLink = 'http://www.windowsphone.com/en-us/store/app/parkme-parking/' +
                                '9b11b6bb-ceee-4367-85a5-f82f14d89a8e';

/* This function is a little magical
  It looks for any <iphone_link></iphone_link> or <android_link></android_link> tags
  on a page and then wraps them in an HTML link <a> with analytics onClick event
  */
mobileTrack.initMobileTags = function () {

    $('iphone_link').each(function () {
        $(this).replaceWith(
            mobileTrack.wrapLink(mobileTrack.iPhoneLink, $(this).attr('action'), $(this).html())
        );
    });


    $('android_link').each(function () {
        $(this).replaceWith(
            mobileTrack.wrapLink(mobileTrack.androidLink, $(this).attr('action'), $(this).html())
        );
    });

    $('windowsPhone_link').each(function () {
        $(this).replaceWith(
            mobileTrack.wrapLink(mobileTrack.windowsPhoneLink, $(this).attr('action'), $(this).html())
        );
    });

};

mobileTrack.wrapLink = function (link, action, content) {
    if (!link || !action || !content) {
        return '';
    }

    return '<a href="' + link +
        '" onclick="mobileTrack.recordPopoutLink(\'' + action + '\', this)" target="_blank">' +
        content + '</a>';
};

mobileTrack.recordPopoutLink = function (action, link) {

    //_trackEvent(category, action, opt_label, opt_value, opt_noninteraction)
    ga('send', 'event', 'Outbound Links', action, link.href); // Google Universal Analytics

};

$(document).ready(mobileTrack.initMobileTags);
;
/* jshint browser:true, camelcase:false, devel:true, jquery:true */

(function () {
  'use strict';
}());

var PimColors = {};

PimColors.HEX_MAP = {
    'blue':   '#58A5F8',
    'gray':   '#BDBDBD',
    'green':  '#58C138',
    'orange': '#ff681f',
    'red':    '#ff0000'
};

PimColors.CLASS_MAP = {
    'blue':   '',
    'gray':   '',
    'green':  'green_bg',
    'orange': 'orange_bg',
    'red':    'red_bg'
};

/** Return the hex code for a given ParkMe color name.
 *
 * @param {string} Color name to map to a hex code.
 * @returns {string} ParkMe specific hex code for color.
 */
PimColors.nameToCode = function (colorName) {
    return PimColors.HEX_MAP[colorName];
};

/** Return the CSS class a given ParkMe color name.
 *
 * @param {string} Color name to map to a hex code.
 * @returns {string} ParkMe specific CSS class name for color.
 */
PimColors.nameToClass = function (colorName) {
    return PimColors.CLASS_MAP[colorName];
};
;
/* global TimeSlider, PimConfig, gettext, ListManager */

/* jshint browser:true, camelcase:false, devel:true, jquery:true */

(function () {
  'use strict';
}());

var Rates = {};

// Defalt mean and stddev in case Rates.updateStatistics is never called.
Rates.mean = 5;
Rates.stddev = 2.5;
Rates.costsLength = 0;
Rates.costsSorted = [];

// Unknown Rate Placeholder
Rates.unknownString = '&mdash;';


/** Updates statistics used by the rate function
 *
 * Computes a bunch of statistics on the Rate structure of
 *  the current map view.  Not all of these statistics
 *  are currently used, so when the dust settles might
 *  consider pruning this.
 *
 * @param {array} List of cost floats.
 */
Rates.updateStatistics = function (costs) {
    var sum,
        sumSquares;

    if (costs.length === 0) {
        return;
    }

    // Calculate mean
    sum = 0;
    $.each(costs, function () {
        sum += this;
    });
    Rates.mean = sum / costs.length;

    // Quartile Stats
    Rates.costsLength = costs.length;
    costs.sort(function(a, b) { return a > b ? 1 : -1;});
    Rates.costsSorted = costs;

    // Calculate std dev
    sumSquares = 0;
    $.each(costs, function () {
        sumSquares += (this - Rates.mean) * (this - Rates.mean);
    });
    Rates.stddev = Math.sqrt(sumSquares / costs.length);

};

/** Test if rates describes a situation where lot can't service request.
 *
 * The rates object is a complex beast.  It can be null or a (possibly
 * empty) list of ParkMe rate objects.  A null list means that no rate
 * data is available, in contrast to an empty list that is used to
 * specify that ParkMe is confidant that the lot can't service the
 * requested request independent of the hours of operation.
 *
 * @param {array} List of ParkMe rate objects.
 * @returns {bool} True if facility is unable to handle requested visit.
 */
Rates.testInvalidRates = function (rates) {
    // Lot is may be open, but can not service the request.
    if (PimConfig.configParams.filter !== 'street' &&
        rates !== null && rates.length === 0) {
        return true;
    }
    return false;
};


/** Extract first rate from possible empty list of rates.
 *
 * ParkMe API returns a list of rates.  This list can be any of null
 * (incorrect, ideally this should not happen any more) or a list of
 * zero or more values.  Uses the `rateCost` member of the first rate
 * object in the array, if one is defined, to describe the cost of
 * staying at this location.
 *
 * NOTE: This may not always be what the user wants.  When more advanced
 * request types are added to the web map, such as "Oversized" or
 * "Motorcycle", this function will need to be extended to search for
 * the most appropriate rate within the list.
 *
 * @param {array|null} Null or an array of zero or more rate objects.
 * @returns {number} Approximate price listed as an integer.
 */
Rates.getRateCost = function (rates) {
    if (!rates || rates === null || rates.length === 0) {
        return null;
    }

    if (PimConfig.configParams.filter === 'street') {
        return rates[0].rate_cost;
    } else {
        return rates[0].rateCost;
    }
};

/** Extract first rate from possible empty list of rates.
 * @param {array|null} Null or an array of zero or more rate objects.
 * @returns {number} Approximate price listed as an integer.
 */
Rates.getFormattedQuotedDuration = function (rates) {

    var days,
        quotedDuration,
        duration;

    if (!rates || rates === null || rates.length === 0) {
        return '';
    }

    if (PimConfig.configParams.filter === 'street') {
        quotedDuration = '';
    } else {
        if (rates[0].quotedDuration) {
            quotedDuration = rates[0].quotedDuration.toLowerCase();
        } else {
            quotedDuration = '';
        }
    }

    if(quotedDuration.indexOf('day') === -1) {
        days = 0;
    } else {
        days = parseInt(/(.*?)day.*/.exec(quotedDuration)[1]);
    }

    duration = /(?:.*?)(\d*?):(\d*?):.*/.exec(quotedDuration);

    if (duration && duration.length > 2) {
        return TimeSlider.formatDuration(days, parseInt(duration[1]), parseInt(duration[2]), rates[0].rateType);
    }
    return TimeSlider.formatDuration(null, null, null, rates[0].rateType);
};



/* Indicates whether or not to show the rate for a lot.
 *
 * @param {bool} True if associated facility is open.
 * @returns {bool} True if rate should not be shown.
 */
Rates.shouldNotShowRate = function (isOpen) {
    var showingReservableRates = (PimConfig.configParams.filter === 'reserve');
    return (isOpen === false && showingReservableRates === false);
};



/* Reformat the calculated cost as an English text string.
 * Used in list and infobubbles
 * See peer in occupancy.js
 *
 * @param {number} Cost as an integer or null if not known.
 * @param {bool} True if associated facility is open.
 * @param {string} Currency symbol.
 * @returns {string} Text description of cost.
 */
Rates.getString = function (cost, isOpen, currency) {
    var rateString,
        rateParts,
        decimalPart;

    if (cost === undefined || cost === null || Rates.shouldNotShowRate(isOpen)) {
        return Rates.unknownString;
    }

    // Format decimals
    rateParts = String(cost).split('.');
    if (rateParts[1] === undefined) {
        // No decimal portion
        rateString = rateParts[0] + '.00';
    } else {
        // Limit number to two decimal places
        decimalPart = (rateParts[1] + '00').substr(0, 2);
        rateString = rateParts[0] + '.' + decimalPart;
    }

    return currency + rateString;
};


/* Provides contextual string for rate (ie, what, where, when)
 * Used for subheadings in list and infobubbles
 *
 * Three special cases exist:
 *   Restricted - Rates not available
 *   Invalid Daily -- Rates not available
 *   Closed -- Closed during your stay or No parking at this time
 */
Rates.getRateContext= function (attr) {

    var doesNotHaveMonthlyRates = (!attr.isOpen && PimConfig.configParams.filter === 'monthly'),
        doesNotHaveDailyRates = (attr.invalidCost);

    if (attr.type === 'Restricted') {
        return gettext('Restricted Use');
    } else if (ListManager.transactionLink(attr.title, attr.reservations, '')) {
        return gettext('Reservable');
    } else if (doesNotHaveMonthlyRates ||doesNotHaveDailyRates) {
        return gettext('Rates not available');
    } else if (Rates.isTemporarilyClosed(attr.isOpen, attr.hrs)) {
        return gettext('Temporarily closed');
    }

    return '';
};


/* Reformat the calculated cost as an English text string.
 * Used in markers
 * See peer in occupancy.js
 *
 * NOTE: Must return a non-empty string to force redraw of markers.
 *
 * @param {number} Cost as an integer or null if not known.
 * @param {bool} True if associated facility is open.
 * @param {string} Currency symbol.
 * @returns {string} Text description of cost.
 */
Rates.getCompactString = function (cost, isOpen, currency) {
    var rateString;

    if (cost === null || cost === undefined || cost < 0 || Rates.shouldNotShowRate(isOpen)) {
        // Single space for unknown cost, negative or if facility isn't open.
        return ' ';
    } else if (cost > 999) {
        // Max displayed cost of 1K.
        return '1K+';
    }

    rateString = Rates.cleanDecimals(cost);
    rateString = Rates.cleanCurrency(cost, currency, rateString);

    return rateString;
};


/* Reformat the calculated cost with decimal logic
 *     1.00 =  1
 *     1.50 = 1<sup>.50</sup>
 *     10.00 = 10
 *
 * @param {number} Cost as an integer or null if not known.
 * @returns {string} Text description of cost.
 */
Rates.cleanDecimals = function (cost) {

    var rateSplit;

    if (cost > 10 || cost % 1 === 0) {
        return cost.toFixed();
    } else if (cost < 1) {
        return cost.toFixed(2).replace('0.', '.');
    }

    rateSplit = cost.toFixed(2).split('.');
    return rateSplit[0] + '<sup>.' + rateSplit[1] + '</sup>';
};

/* Add currency to a rate string
 *
 * @param {number} Cost as an integer or null if not known.
 * @returns {string} Text description of cost.
 */
Rates.cleanCurrency = function (cost, currency, rateString) {

    // TODO: We need to figure out the logic for foreign currencies
    //  when combined with triple digits (either decimals or triple digits)

    if (cost >= 1000) {
        // Triple digits is too big for pin.
        return rateString;
    }

    return '<sup>' + currency + '</sup>' + rateString;
};

/** Test if a lot is closed
 *
 * @param {bool} True if the facility is currently open.
 * @param {bool} True if the facility is known to have no valid rates.
 * @returns {bool} True if a lot is closed. False otherwise.
 */
Rates.isClosed = function (isOpen, invalidCost) {
    // Facilities unable to handle request are gray
    if (isOpen === false || invalidCost) {
        return true;
    }

    return false;
};


/** Test if lot is temporarily closed
 *
 * @param {bool} True if the facility is currently open.
 * @param {array} Contains "Temporarily Closed" if temporarily closed.
 * @returns {bool} True if the lot is temporarily closed. False otherwise.
 */
Rates.isTemporarilyClosed = function(isOpen, hours) {
    if (isOpen === false && hours && hours.indexOf('Temporarily Closed') > -1) {
        return true;
    }

    return false;
};


/** Map specified rate to a view specific color name.
 *
 * Compares the specified rate to those rates in the current view.
 * Relatively high rates are red while relatively low rates are green.
 *
 * @param {bool} True if the facility is currently open.
 * @param {bool} True if the facility is known to have no valid rates.
 * @param {number} Cost for stay at this facility.
 * @returns {string} Color name that is one of 'green', 'orange', 'red',
 * 'blue', or 'gray'.
 */
Rates.getColorName = function (isOpen, invalidCost, cost, imgUrl) {
    // Facilities unable to handle requests (CLOSED)
    if (Rates.isClosed(isOpen, invalidCost)) {
        return 'transparent';
    }

    // Facilities with no rate data
    if (cost === null) {
        return 'green';
    }

    // if ON the monthly filter, show a grey dot
    // otherwise show a blue pin
    // this is just for the colors; rest of functionality is in listManager.js
    if (imgUrl.indexOf('payment-') !== -1) {
        if (PimConfig.configParams.filter === 'monthly') {
            return 'transparent';
        } else {
            return 'blue';
        }
    }

    return 'green';
};
;
/* global gettext, Rates, occupancy */

/* jshint browser:true, camelcase:false, devel:true, jquery:true */

'use strict';

var Occupancy = {};

/** Obtain color associated with the lot focused on occupancy.
 *
 * @param {bool} False if lot is known to be closed.
 * @param {bool} True if no rate satisfies requested stay.
 * @param {object} ParkMe occupancy object.
 * @returns {string} One of 'gray', 'transparent', 'green', 'orange', or 'red'.
 */
Occupancy.getColorName = function (isOpen, invalidCost, occupancy) {
    var occPct,
        occIndex,
        occFull;

    // If occ_pct exists, we're on the street layer.
    if (occupancy && (occupancy.occ_pct || occupancy.pct)) {
        occPct = occupancy.occ_pct ? occupancy.occ_pct : occupancy.pct;
        occIndex = occupancy.occ_index ? occupancy.occ_index : occupancy.bucket;
        occFull = occupancy.occ_full;
    } else if (occupancy) {
        occPct = occupancy.occPct;
        occIndex = occupancy.occIndex;
        occFull = occupancy.occFull;
    }

    // Lot is not open.
    if (Rates.isClosed(isOpen, invalidCost)) {
        return 'gray';
    }

    // Default when occupancy is not known.
    if (!occupancy) {
        return 'green';
    }

    // Map occupancy to color.
    if (occFull === true ||
            occIndex === 3 ||
            occIndex === 4 ||
            (occPct >= 90 && occPct <= 100)) {
        return 'red';
    } else if (occIndex === 2 ||
            (occPct < 90 && occPct >= 65)) {
        return 'orange';
    } else if (
            (occIndex !== null && (occIndex === 0 ||
                occIndex === 1)) ||
            (occPct !== null && (occPct < 65 && occPct >= 0))) {
        return 'green';
    }
    return 'gray';
};

/** Given an occupancy this returns the string.
 */
Occupancy.getString = function (isOpen, invalidCost, occupancy) {
    var occPct,
        occIndex,
        occAvail;

    // If occ_pct exists, we're on the street layer.
    if (occupancy && (occupancy.occ_pct || occupancy.pct)) {
        occPct = occupancy.occ_pct ? occupancy.occ_pct : occupancy.pct;
        occIndex = occupancy.occ_index ? occupancy.occ_index : occupancy.bucket;
        occAvail = occupancy.occ_avail ? occupancy.occ_avail : occupancy.available;
    } else if (occupancy) {
        occPct = occupancy.occPct;
        occIndex = occupancy.occIndex;
        occAvail = occupancy.occAvail;
    }

    var colorName = Occupancy.getColorName(isOpen, invalidCost, occupancy);

    // Lot is not open.
    if (Rates.isClosed(isOpen, invalidCost)) {
        return '';
    }

    if (occupancy &&
        occAvail !== null) {
        return occAvail + gettext(' Spaces Available');
    } else if (occupancy &&
            occPct !== null &&
            occPct >= 0 &&
            occPct <= 100) {
        return occPct + '% ' + gettext('Full');
    } else if (colorName === 'red') {
        return gettext('High Occupancy');
    } else if (colorName === 'orange') {
        return gettext('Medium Occupancy');
    } else if (colorName === 'green' && occupancy && occIndex !== null) {
        return gettext('Low Occupancy');
    } else if (colorName === 'green') {
        return gettext('Spots Available');
    }
    return '';
};

/** Given an occupancy this returns a compact rate string for the occupancy bubble.
 *
 * NOTE: Don't show occ_pct for meters.  This is a request from LA ExpressPark.
 */
Occupancy.getCompactString = function (isOpen, invalidCost, occupancy) {
    var occPct,
        occIndex;

    // If occ_pct exists, we're on the street layer.
    if (occupancy && (occupancy.occ_pct || occupancy.pct)) {
        occPct = occupancy.occ_pct ? occupancy.occ_pct : occupancy.pct;
        occIndex = occupancy.occ_index ? occupancy.occ_index : occupancy.bucket;
    } else if (occupancy) {
        occPct = occupancy.occPct;
        occIndex = occupancy.occIndex;
    }

    var colorName = Occupancy.getColorName(isOpen, invalidCost, occupancy);

    // Lot is not open.
    if (Rates.isClosed(isOpen, invalidCost)) {
        return gettext('Closed');
    }

    if (occupancy &&
        occPct !== null &&
        occPct >= 0 &&
        occPct <= 100) {
        return occPct + '% ' + gettext('Full');
    } else if (colorName === 'red') {
        return gettext('High Occ');
    } else if (colorName === 'orange') {
        return gettext('Med Occ');
    } else if (colorName === 'green' && occupancy && occIndex !== null) {
        return gettext('Low Occ');
    } else if (colorName === 'green' && occupancy) {
        return gettext('Avail');
    }

    // NOTE: Must pass non-empty string to trigger redraw of markers.
    return gettext('--');
};

/** True if an occupancy percent should be displayed for this facility.
 */
Occupancy.showOccupancy = function (isOpen, invalidCost, occupancy) {
    if (!occupancy) {
        return false;
    }
    return true;
};

/** Returns an aribtary weight, used to compare two occupancys against each other
 *
 */
Occupancy.getWeight = function (lot) {
    var occPct,
        isOpen;

    // If occ_pct exists, we're on the street layer.
    if (occupancy && (occupancy.occ_pct || occupancy.pct)) {
        occPct = occupancy.occ_pct ? occupancy.occ_pct : occupancy.pct;
        isOpen = lot.attributes.is_open;
    } else if (occupancy) {
        occPct = lot.attributes.occupancy.occPct;
        isOpen = lot.attributes.isOpen;
    }

    var weight,
        color,
        colorWeights;

    colorWeights = {
        'transparent': 5000,
        'gray': 4000,
        'red': 3000,
        'orange': 2000,
        'green': 1000
    };

    color = Occupancy.getColorName(
            isOpen,
            lot.attributes.invalidCost,
            lot.attributes.occupancy
        );

    weight = colorWeights[color];

    if (lot.attributes.occupancy && occPct === null) {
        weight += 101;
    } else if (lot.attributes.occupancy) {
        weight += occPct;
    }

    return weight;
};
;
/* global gettext */

/* jshint browser:true, camelcase:false, devel:true, jquery:true */

'use strict';

var Probability = {};

/** Obtain color associated with the lot focused on occupancy.
 *
 * @param {bool} False if lot is known to be closed.
 * @param {bool} True if no rate satisfies requested stay.
 * @param {object} ParkMe occupancy object.
 * @returns {string} One of 'gray', 'transparent', 'green', 'orange', or 'red'.
 */
Probability.getColorName = function (isOpen, invalidCost, probability) {
    if (isOpen) {
        if (probability === 3 ||
            probability === null ||
            probability === undefined) {
            return 'green';
        } else if (probability === 2) {
            return 'orange';
        } else if (probability === 1) {
            return 'red';
        }
    } else {
        return 'gray';
    }
};

/** Given an occupancy this returns the string.
 */
Probability.getString = function (isOpen, invalidCost, probability) {
    var colorName = Probability.getColorName(isOpen, invalidCost, probability);

    if (colorName === 'red') {
        return gettext('Low Probability');
    } else if (colorName === 'orange') {
        return gettext('Medium Probability');
    } else if (colorName === 'green') {
        return gettext('High Probability');
    } else if (!isOpen) {
        return gettext('No Parking');
    }
};

/** Given an occupancy this returns a compact rate string for the occupancy bubble.
 *
 * NOTE: Don't show occ_pct for meters.  This is a request from LA ExpressPark.
 */
Probability.getCompactString = function (isOpen, invalidCost, probability) {
    var colorName = Probability.getColorName(isOpen, invalidCost, probability);

    if (colorName === 'red') {
        return gettext('Low Probability');
    } else if (colorName === 'orange') {
        return gettext('Med Probability');
    } else if (colorName === 'green') {
        return gettext('High Probability');
    } else if (!isOpen) {
        return gettext('No Parking');
    }
};
;
/* global PimConfig, gettext, Rates */

/* jshint browser:true, camelcase:false, devel:true, jquery:true */

(function () {
  'use strict';
}());

/* This class is used to handle reservation types */

var Transactions = {};

Transactions.seeDetails = function (rateString, lotId, meterId) {
    var lotMeterId;

    // Check if lot or meter id and set the
    // See Details button url accordingly.
    if (lotId !== undefined) {
        lotMeterId = '/lot/' + lotId;
    } else {
        lotMeterId = '/meter/' + meterId;
    }

    return '<a class="left btn btn-primary btn-small fle_reserve compare-res-btn" href=' +
            '"' + lotMeterId + '">' + rateString + '</a>';
};

/** Determine if the lot has any daily parking links
 *
 * @param {array} List of reservation objects from ParkMe API
 * @returns {bool} True if reservable, false otherwise
 */
Transactions.getDaily = function (reservations) {
    var res = null;

    if ($.isArray(reservations) && Transactions.testDaily()) {
        $.each(reservations, function () {
            if (this.monthly === false) {
                res = this;
                return false;
            }
        });
    }

    return res;
};

/** Determine if the lot has any monthly parking links
 *
 * @param {array} List of TAPI objects from ParkMe API
 * @returns {bool} True if reservable, false otherwise
 */
Transactions.getMonthly = function (reservations) {
    var res = null;

    if ($.isArray(reservations) && Transactions.testMonthly()) {
        $.each(reservations, function () {
            if (this.monthly === true) {
                res = this;
                return false;
            }
        });
    }

    return res;
};

Transactions.testDaily = function () {
    return (PimConfig.configParams.filter !== 'monthly');
};

Transactions.testMonthly = function () {
    return (PimConfig.configParams.filter === 'monthly');
};

/* Determines if reservation is internal or external by checking the source
   @param (object) - Reservation object
   @returns (bool) - True/False
*/
Transactions.isInternal = function (reservation) {
    return (reservation.source === 'ParkMe');
};

/** Dropdown menu wrapper */
Transactions.dropDownWrapper = function (reservations) {

    var displayRate,
        listObj = {},
        listItem = '',
        wrapperDiv = '<div class="compare-menu btn btn-primary btn-small" data-toggle="dropdown">&#x25bc;</div>';

    // Iterrates through reservations and filters out
    // duplicate affiliate lots
    $.each(reservations, function () {
        if (this.source !== 'Colonial Monthly') {
        // Per MID-1561, patch-fixing since the api
        // doesn't pass an affiliate name for meters.
        if (this.source === undefined) {
            this.source = 'Pay With Phone';

        // Detect duplicates
        } else if (listObj[this.source]) {
            return;

        // If we have rate
        } else if (this.rate) {
            displayRate = ' - $' + this.rate.toFixed(2);

        // Fallback
        } else {
            displayRate = '';
        }

        listObj[this.source] = this.source;

        listItem += '<li role="presentation"><a href="' +
                Transactions.hrefLink(this.link) + '" target="_blank" rel="nofollow">' +
                this.source + displayRate + '</a></li>';
       }
    });

    return wrapperDiv +
        '<ul class="dropdown-menu compare-list" role="menu" aria-labelledby="dropdownMenu2">' +
            listItem +
        '</ul>';
};

Transactions.compareResClass = 'compare-res-btn';

Transactions.options = {
    'map': {
        'target': 'rel="nofollow"',
        'classes': Transactions.compareResClass,
        'text': '',
        'targetBlank': ''
    },
    'lotpage': {
        'target': 'rel="nofollow"',
        'classes': Transactions.compareResClass + ' lot-page-btn lot-page-res-btn',
        'text': '<div class="res-btn-inner">' + gettext('Reserve a Spot Here') + '</div>',
        'targetBlank': ' target="_blank"'
    },
    'nearbylots': {
        'target': 'rel="nofollow"',
        'classes': Transactions.compareResClass + ' widget-res-btn uppercase',
        'targetBlank': ''
    },
    'widget': {
        'target': 'rel="nofollow"',
        'classes': Transactions.compareResClass,
        'text': '',
        'targetBlank': '',
        'wTargetBlank': {
            'empty': '',
            'newTab': ' target="_blank"'
        }
    }
};

Transactions.soldOutButton = function () {
    return '<a class="module-button btn-primary medium gray_bg right see-details-btn sold-out uppercase">' +
                gettext('Sold Out') + '</a>';
};

// Iterates through the reservations and returns
// the monthly reservation link if available.
Transactions.getMonthlyLink = function (reservations) {
    var monthlyLink = '';

    $.each(reservations, function () {
        if (this.monthly) {
            monthlyLink = Transactions.hrefLink(this.link);
        }
    });

    return monthlyLink;
};

// Checks to see if lot's reservation product matches filter.
Transactions.hasReservationProductsMatchingFilter = function (reservations) {
    if (reservations.length === 1 &&
        reservations[0].source === 'Colonial Monthly') {
        return true;
    }

    return reservations.some(function (rp) {
        // If on the monthly filter and lot
        // has monthly reservation...
        if (Transactions.testMonthly()) {
            return rp.monthly;
        }

        // Return false (not a monthly reservation)
        return !rp.monthly;
    });
};

// Return true if it's:
//     -- not an array
//     -- an empty array
//     -- a monthly res but not on the monthly filter
Transactions.shouldDisplayReserveButton = function(reservations) {
    return (
        $.isArray(reservations) &&
        reservations.length > 0 &&
        Transactions.hasReservationProductsMatchingFilter(reservations)
    );
};

// Draws affiliate lot reserve button and dropdown menu
Transactions.drawButton = function (name, reservations, rateString, f_id) {
    var html = '',
        opt,
        classes = 'left btn btn-primary btn-small fle_reserve ',
        link,
        goToRes = '',
        dropdownWrapper = '',
        isColonial = false;

    if (!Transactions.shouldDisplayReserveButton(reservations)) {
        return '';
    } else if (reservations[0].available_spots === 0) {
        return Transactions.soldOutButton();
    } else {
        link = Transactions.hrefLink(reservations[0].link);
    }

    // Only show a dropdown if it's Colonial Monthly.
    isColonial = reservations.some(function(res) {
        return res.source === 'Colonial Monthly';
    });

    if (isColonial) {
        dropdownWrapper = Transactions.dropDownWrapper(reservations);
    }

    switch (PimConfig.MAP_TYPE) {

        case 'DESTINATION':
            opt = Transactions.options.nearbylots;
            opt.text = rateString;

            // Hash to trigger showing of
            // products in lot page.
            goToRes = '#products';

            if (rateString === '____') {
                opt.text = gettext('Reserve');
            }

            // On a destination page, reserve button
            // goes to the lotpage instead.
            if (Transactions.isInternal(reservations[0])) {
                link = Transactions.hrefLink(reservations[0].link + goToRes);
            } else {
                link = '/lot/' + f_id;
            }
            break;

        case 'WIDGET':
            opt = Transactions.options.widget;

            // If the reservation is monthly, show Monthly
            // in the button and add target="_blank".
            // Otherwise, show Reserve.
            if (Transactions.testMonthly()) {
                opt.text = gettext('Monthly');
                opt.targetBlank = opt.wTargetBlank.newTab;
                link = Transactions.getMonthlyLink(reservations);
            } else if (isColonial &&
                rateString === '&mdash;' &&
                Transactions.hasReservationProductsMatchingFilter(reservations)) {
                opt.text = 'Monthly';
            } else {
                opt.text = rateString;
                opt.targetBlank = opt.wTargetBlank.empty;
            }
            break;

        case 'LOTPAGE':
            opt = Transactions.options.lotpage;
            break;

        default:
            opt = Transactions.options.map;
            opt.text = rateString;
    }

    // Renders the standard lotpage button
    html = '<a class="' + classes + opt.classes + '" ' + opt.target +
                ' href="' + link + '"' +
                opt.targetBlank + '>' +
                opt.text + '</a>' +
                dropdownWrapper;

    return html;
};

// Modifies api urls
Transactions.hrefLink = function (reservation) {
    // Normal links
    if (reservation) {
        var link = reservation;

        // Shows partner redirect page
        if (link.indexOf('/map/partner_redirect') !== -1) {
            return link + '&show=true';
        }

        // Make this URL relative so we can run reservations on other servers.
        return link.replace('https://www.parkme.com/', '/');
    }

    return '';
};
;
/* global MapPage, Occupancy, Rates, InfoWindow, PimConfig, ListManager */

/* jshint browser:true, camelcase:false, devel:true, jquery:true */

'use strict';

var Facility = function () {

    this.attributes = null;
    this.marker = null;
    this.focused = false;
    this.markerSize = null;
    this.thresholdPadding = 1.75; // collision detection


    /* Hover & Click Functions */

    this.focus = function (facilityId) {

        var maxRows = null,
            markerOptions = {},
            id = this.attributes.id || this.attributes.blockID,
            thisMarker = this.attributes.segments ?
                            this.segmentMarkers[0].mapMarker : this.marker.mapMarker;

        // Nothing needed if facility is already in focus
        if (this.focused) {
            return;
        }

        // unfocus previous (don't bother if already focused)
        if (Facility.currentFocus !== null) {
            Facility.currentFocus.unfocus();
        }

        // markerOptions
        markerOptions.disableAutoPan = false;
        if (this.marker.showBubble) {
            markerOptions.yOffset = 12;
        }

        // highlight list
        ListManager.highlightListItem(id);

        // determine max number of rate rows
        if (this.attributes.detailPage) {

            // Webmap Infobubble shouldn't show "More..." if the Hours is a one-liner
            // (ie: 24 Hours, 24/7, etc). It should just show the Hours.
            // Relates to issue #1903
            if (this.attributes.hrs && this.attributes.hrs.length === 1) {
                maxRows = 4;
            } else {
                maxRows = 3;
            }
        }

        // if infobubble property, show infobubble
        if (PimConfig.configParams.infoBubble) {

            // Show InfoWindow
            var content;

            if (this.showMobile()) {
                content = InfoWindow.getMobile(this.attributes, this.marker.colorName);
                markerOptions['maxWidth'] = 300;
            } else {
                content = InfoWindow.getFull(this.attributes, this.marker.colorName, maxRows);
            }

            this.focused = true;
            this.marker.pepsUpdate();

            // Don't show polygons/lines/peps if block
            if (!this.attributes.blockID) {
                this.marker.pepsShow(MapPage.map);
                this.marker.polygonsShow(MapPage.map);
            }

            if (PimConfig.configParams.showAll === true && (this instanceof Lot)) {
                MapPage.ppMap.openInfoWindow(
                content,
                thisMarker,
                markerOptions,
                facilityId,
                true
                );
            } else {
                MapPage.ppMap.openInfoWindow(
                content,
                thisMarker,
                markerOptions,
                facilityId
                );
            }

            Facility.currentFocus = this;
        }
    };

    // Used to show full rates and hours
    this.expand = function () {

        var maxRows = null,
            markerOptions = {},
            thisMarker = this.attributes.segments ?
                            this.segmentMarkers[0].mapMarker : this.marker.mapMarker;

        // markerOptions
        markerOptions.disableAutoPan = true;
        if (this.marker.showBubble) {
            markerOptions.yOffset = 12;
        }

        // Show InfoWindow
        var content = InfoWindow.getFull(this.attributes, this.marker.colorName, maxRows);

        MapPage.ppMap.openInfoWindow(
            content,
            thisMarker,
            markerOptions
        );

        this.focused = true;
        Facility.currentFocus = this;
    };

    this.unfocus = function () {
        var id = this.attributes.id || this.attributes.blockID;

        this.marker.pepsHide();

        // Don't hide the meter lines when
        // clicking off info bubble.
        if (PimConfig.configParams.filter !== 'street') {
            this.marker.polygonsHide();
        }

        this.focused = false;
        Facility.currentFocus = null;

        // clear highlight
        ListManager.clearListItem(id);
    };


    this.hover = function () {

        var markerOptions = {},
            hoverDelay = 100,
            marker = this.marker,
            content = InfoWindow.getHover(this.attributes, this.marker.colorName),
            id = this.attributes.id || this.attributes.blockID,
            thisMarker = this.attributes.segments ?
                            this.segmentMarkers[0].mapMarker : marker.mapMarker;

        // Nothing needed if facility is already in focus
        if (Facility.currentFocus !== null) {
            return;
        }

        // markerOptions
        if (this.marker.showBubble) {
            markerOptions.yOffset = 12;
        }

        // Similar to the jquery hover-intent library
        //  we delay the showing of the hover state slightly (~100ms)
        //  in order to improve the UI experience
        if (PimConfig.configParams.infoBubble && !this.showMobile()) {
            this.hoverClear();
            Facility.hoverTimer = setTimeout(function () {
                MapPage.ppMap.openInfoWindow(
                    content,
                    thisMarker,
                    markerOptions
                );
            }, hoverDelay);
        }

        // highlight list
        ListManager.highlightListItem(id);
    };

    this.hoverClear = function () {
        var id = this.attributes.id || this.attributes.blockID;

        // Nothing needed if facility is already in focus
        if (Facility.currentFocus !== null) {
            return;
        }

        // clear highlight
        ListManager.clearListItem(id);

        // Used for clearing of hoverintent timer
        if (Facility.hoverTimer) {
            clearTimeout(Facility.hoverTimer);
            Facility.hoverTimer = null;
        }

        // Used to destroy infobubble on mouseout
        if (Facility.currentFocus === null) {
            MapPage.ppMap.closeAllInfoWindows();
        }
    };

    this.showMobile = function () {
        return (PimConfig.isWidget && !PimConfig.configParams.detailedBubble);
    };

    /* Draw Functions */
    this.updateAndDrawMarker = function (map) {

        // Hide label text if this is a dot rather than a bubble.
        if (!this.marker.showBubble) {
            this.marker.mapMarkerHide();
        } else {
            this.updateMarker(map);
            this.marker.mapMarkerShow(map);
        }
    };

    /** Draw / update style of all polygons associated with facility on map.
     *
     * Uses current data about the facility including open status,
     * rates, and occupancy to restyle and then draw the polygons on the
     * specified map.
     */
    this.updateMarker = function (map) {
        var markerSize,
            strokeWeight,
            occOrProb = this.attributes.occupancy || this.attributes.probability;

        markerSize = this.markerSize;
        strokeWeight = this.getStroke(markerSize);
        this.marker.occupancy = this.attributes.occupancy || this.attributes.probability;
        this.marker.polygonsUpdate(strokeWeight);
        this.marker.redrawPin(
            markerSize,
            this.visible,
            this.attributes.isOpen,
            this.attributes.cost,
            this.attributes.invalidCost,
            occOrProb,
            this.attributes.currency,
            strokeWeight,
            map,
            this.facilityType
        );

        // Place polygons on map
        if (this.marker.drawPolys) {
            this.marker.polygonsShow(map);
        }
    };
};

/* Clean functions */

Facility.prototype.cleanAttributes = function (attributes) {

    var cleanAddressData,
        attr = $.extend({}, attributes);

    // Convert distance to miles
    if (isNaN(parseFloat(attr.distance))) {
        attr.distance = '';
    } else {
        attr.distance = parseFloat(attr.distance / 1609.34).toFixed(2);
    }

    // Prefer building to navigation address
    if (attr.buildingAddress) {
        attr.address = attr.buildingAddress;
    } else if (attr.navigationAddress) {
        attr.address = attr.navigationAddress;
    }

    if (Array.isArray(attr.address) && PimConfig.MAP_TYPE === 'LOTPAGE') {
        attr.address = attr.address[0] + ', ' + attr.address[1];
    }

    // clean currency
    if (!attr.currency) {
        attr.currency = '$';
    }

    cleanAddressData = Facility.cleanAddress(
            attr.name,
            attr.address,
            attr.buildingAddress);
    // TODO: Do we really want to update the lot name?
    attr.name = cleanAddressData.name;
    attr.title = cleanAddressData.title;
    attr.subtitle = cleanAddressData.subtitle;
    return this.cleanRatesOccupancy(attr);

};

Facility.cleanAddress = function (name, navAddress, buildingAddress) {
    // Extract title and sub-title from from the lot data.
    //
    // See https://github.com/ParkMeInc/iphone/issues/295 for the less
    // than easy to read specification.
    //
    // Returns a dictionary with keys 'name', 'title', and 'subtitle'
    // which will all always be (possibly empty) strings.
    var buildingAddressLines = '';
    var nameArray = '';
    var navAddressLines = '';
    var title;
    var subtitle;
    // Use only first CSV chunk from name
    nameArray = name.split(',');
    name = nameArray[0];

    // Core logic for title and subtitle
    if (PimConfig.configParams.filter === 'street') {
        navAddressLines = {
            line1: navAddress,
            line2: ''
        };
    } else {
        navAddressLines = {
            line1: navAddress.street,
            line2: navAddress.city + ', ' + navAddress.state + ' ' + navAddress.postal
        };
    }

    if (buildingAddress) {
        if (Array.isArray(buildingAddress) && PimConfig.MAP_TYPE === 'LOTPAGE') {
            buildingAddress = buildingAddress[0] + ', ' + buildingAddress[1];
        }

        buildingAddressLines = {
            line1: buildingAddress.street,
            line2: buildingAddress.city + ', ' + buildingAddress.state + ' ' + buildingAddress.postal
        };

        if (name === navAddressLines.line1 || name === buildingAddressLines.line1) {
            title = buildingAddressLines.line1;
            subtitle = buildingAddressLines.line2;
        } else {
            title = name;
            subtitle = buildingAddressLines.line1;
        }
    } else {
        if (name === navAddressLines.line1) {
            title = navAddressLines.line1;
            subtitle = navAddressLines.line2;
        } else {
            title = name;
            subtitle = navAddressLines.line1;
        }
    }

    return {
        'name': name,
        'title': title,
        'subtitle': subtitle
    };
};

Facility.getOccupancyFromAttr = function (attr) {
    return attr.occupancy;
};

Facility.prototype.cleanRatesOccupancy = function (attributes) {
    var rates,
        occupancy = Facility.getOccupancyFromAttr(attributes),
        attr = $.extend({}, true, attributes);

    if (attr.segments && attr.segments[0]) {
        // If blocks
        rates = attr.segments[0].calculatedRates;
    } else {
        // If segments
        rates = attr.calculatedRates;
    }

    // Clean up rate data
    // If on the widget and Hide All Rates is selected,
    // Hide all rate info in list, marker and infoBubble.
    if (!PimConfig.configParams.hideRates) {
        attr.cost = Rates.getRateCost(rates);
    } else {
        attr.cost = null;
    }

    attr.invalidCost = Rates.testInvalidRates(rates);
    attr.quotedDuration = Rates.getFormattedQuotedDuration(rates);

    return attr;
};

Facility.currentFocus = null;;
/*global google, log, MapPage, PimUtil, PimConfig, ListManager, Transactions,
    DRAG_END, LAT, LONG, $, RES_RADIUS, Rates, OPERATORS */

/* jshint browser:true, camelcase:false, devel:true, jquery:true */

var FacilityManager = function () {

    this.cache = {};
    this.map = null;

    this.initialize = function (map) {
        this.map = map;
    };

    this.drawOnMap = function () {
        //draw on map
        if (this.zoom > 0) {
            MapPage.customEvents.dispatch('redraw_list');
        }
    };

    // Clear Cache
    // okay, so there's two problems which I'm attempting to fix here
    // not convinced this is the best approach, but it seems like two birds
    // one stone for now
    //   1. Cache and memory build up over time and can get a little heavy
    //         after extended use
    //   2. Without knowing if has_loaded and if ajax in_flight.. I'm not sure
    //         when to display the "no lots found" modal.
    //
    this.resetManager = function () {

        // Hide all markers and change list to empty DIV
        ListManager.updateResultsDiv(null);

        FacilityManager.hideAllMarkers(this.cache);

        this.cache = {};

        // referencing GitHub issue #2650
        // removing this takes our network calls from three to two
        // this.lastActualBounds = null;
    };

    this.showLoading = function (loading) {
        var loader;
        var spinner;

        // If window is less than or equal to 768px,
        // show the mobile loader.
        if (MapPage.mobileWidth()) {
            loader = $('.loading-mobile');
            spinner = $('.loading-mobile .loading-indicator');
        } else {
            loader = $('#loading');
            spinner = $('#loading .loading-indicator');
        }

        // If loading, animate the loader in
        // Otherwise animate it out
        if (loading) {
            loader.fadeIn(300);
            setTimeout(function () {
                spinner.addClass('active');
            }, 150);
        } else {
            spinner.addClass('leave');
            setTimeout(function () {
                loader.fadeOut(300);
                setTimeout(function () {
                    spinner.removeClass('leave active');
                }, 400);
            }, 100);
        }
    };

    this.APIRequest = function (bounds, restrictions) {
        var bboxString,
            data,
            thisManager = this,
            lotFilter = PimConfig.configParams.lotFilter;

        // If no lots are available,
        // set lotFilter to null.
        if (lotFilter === '') {
            lotFilter = 'null';
        }

        if (this.JSONPrequest) {
            this.JSONPrequest.abort();
        }

        // This is responsible for zoom + non-loading meters
        // in PWS-2001. Haven't found a fix yet.
        if (!this.active) {
            return;
        }

        // if critical data is missing...
        if (!bounds ||
                MapPage.timeSlider === null ||
                MapPage.timeSlider.startTime === undefined) {
            log.warn(
                    'Bounds or timeSlider missing.  Cancelling ' +
                    'APIRequest for ' + this.URL);
            return;
        }

        // only used for diagnostic purposes,
        //  shows the over query of bounds
        if (PimConfig.configParams.showOver) {
            this.showOverQuery(bounds);
        }

        bboxString = FacilityManager.getBboxString(bounds);

        // If the lotFilter parameter is passed from the url
        // and not on a destination page, use the lotFilter/f_id query.
        // Otherwise, use the bboxString query.
        if (lotFilter !== undefined &&
            lotFilter !== 'null') {
            data = $.extend({}, PimConfig.globalParams(), {
                entry_time: PimUtil.ISODateFormat(MapPage.timeSlider.startTime),
                id: lotFilter,
                chk: PimConfig.getCHK(lotFilter),
            });
        } else if (PimConfig.MAP_TYPE === 'DESTINATION'  &&
            typeof(DRAG_END) !== 'undefined' && !DRAG_END) {
            var pointRadius = LAT + '|' + LONG;

            data = $.extend({}, PimConfig.globalParams(), {
                point: pointRadius,
                radius: RES_RADIUS,
                chk: PimConfig.getCHK(pointRadius + '|' + RES_RADIUS),
                entry_time: PimUtil.ISODateFormat(MapPage.timeSlider.startTime)
            });
        } else if (PimConfig.configParams.filter === 'street') {
            var factor = (17 - this.zoom) / 2;

            // Change the bounds based on zoom level.
            if (this.zoom > 16) {
                // Default bounds.
                PimConfig.DEFAULT_PADDED_VIEW_BOUNDS = 2.5;
            } else {
                // Bounds are smaller when zoomed out.
                PimConfig.DEFAULT_PADDED_VIEW_BOUNDS = 2.5 - factor;
            }

            data = $.extend({}, PimConfig.globalParams(), {
                box: bboxString,
                chk: PimConfig.getCHK(bboxString),
                entry: PimUtil.ISODateFormat(MapPage.timeSlider.startTime),
                duration: 60,
            });

            if (restrictions) {
                data.restrictions = restrictions;
            }
        } else {
            // Reset bounds to default.
            PimConfig.DEFAULT_PADDED_VIEW_BOUNDS = 2.5;

            data = $.extend({}, PimConfig.globalParams(), {
                box: bboxString,
                chk: PimConfig.getCHK(bboxString),
                entry_time: PimUtil.ISODateFormat(MapPage.timeSlider.startTime)
            });
        }

        // do not query for none
        if (PimConfig.configParams.filter === 'none') {
            return;
        }

        // If not monthly, we pass a duration
        else if (PimConfig.configParams.filter !== 'monthly') {
            data.duration = MapPage.timeSlider.duration;

            if (PimConfig.configParams.filter === 'street') {
                data.rate_request = 'B';
            } else if (PimConfig.configParams.filter !== 'daily') {
                data.rate_request = 'R';
            }
        } else {
            data.rate_request = 'L';
        }

        // show loading
        thisManager.showLoading(true);

        // This is the new bounds
        thisManager.lastQueryBounds = bounds;

        data.limit = this.limit;
        data.locale = PimConfig.LANGUAGE_CODE;

        data.pk_operator = typeof(OPERATORS) !== 'undefined' ?
            OPERATORS : null;

        data.pk_owner = typeof(OPERATORS) !== 'undefined' ?
            OPERATORS : null;

        this.JSONPrequest = $.jsonp({
            type: 'GET',
            data: data,
            timeout: 0,
            callbackParameter: 'callback',
            url: PimUtil.getVirtualHost('api') + this.URL
        });
        return this.JSONPrequest.then(function (response) {
            // Reset lot filter so amenities filter works.
            if (PimConfig.MAP_TYPE === 'DESTINATION') {
                PimConfig.configParams.lotFilter = '';
            }

            thisManager.handleData(response);

            // Turn off the loading message
            thisManager.showLoading(false);
            return true;
        });
    };

    this.getZoomChange = function () {

        var zoomChange,
            newZoom;

        if (!this.map) {
            return;
        } else {
            newZoom = this.map.getZoom();
        }

        if (!this.zoom || this.zoom === newZoom) {
            zoomChange = 0;
        } else {
            zoomChange = this.zoom - newZoom;
        }

        this.zoom = newZoom;
        return zoomChange;
    };

    // TODO: Look into rate or occupancy specific refresh mechanisms.
    this.refresh = function (restrictions) {
        var newMarkerSize,
            zoomChange,
            bbox,
            sw,
            ne,
            testIsEmpty;

        zoomChange = this.getZoomChange();
        newMarkerSize = this.getMarkerSize();

        if (!this.map) {
            return false;
        }

        // if zoomed out draw Layer
        if (this.tileLayer !== undefined) {
            this.tileLayer();
        }

        // Zoom out to tile layer
        if (newMarkerSize === 0) {

            // Redraw list and collisions
            this.drawOnMap();

            // Close infowindows at tilelayer
            MapPage.ppMap.closeAllInfoWindows();

        // Zoom in/out
        } else if (!restrictions &&
            this.zoom !== 15 &&
            zoomChange !== 0) {

            // Redraw list and collisions
            this.drawOnMap();

        // Zoom Out or Drag Event
        } else {

            bbox = this.map.getBounds();


            sw = bbox.getSouthWest();
            ne = bbox.getNorthEast();

            testIsEmpty = FacilityManager.testIsEmpty(sw, ne);

            this.lastActualBounds = MapPage.map.getBounds();

            if (testIsEmpty && PimConfig.MAP_TYPE !== 'DESTINATION' &&
                PimConfig.MAP_TYPE !== 'LOTPAGE') {
                log.info('Map isn\'t loaded yet');
                return;
            }
            return this.APIRequest(MapPage.getPaddedViewBounds(), restrictions);
        }
        return false;
    };

    this.center = function (facility) {

        var thisManager = this;

        // Beware: extremely hacky code.
        // The goal is to center the map, if a lot parameter is passed
        // However, this seems to clash with the drawing of the InfoBubble.
        //  The asynchronous draw function moves of the map one direction,
        //  At the same time, the asynchrounous pan or center functions moves opposite.
        //  The only solution I can figure out is to set a small timeout on
        //  either of the function so they don't clash. I don't like it and am
        //  not happy with it but can't figure out a better solution.
        setTimeout(function () {
            thisManager.map.panTo(facility.marker.mapMarker.getPosition());
            if (PimConfig.configParams.infoBubble) {
                thisManager.map.panBy(0, -100); // give a little room for infobubble
            }
        }, 100);

    };

    // Diagnostic Purposes Only
    this.showOverQuery = function (bounds) {
        var overPoly;
        if (!FacilityManager.SHOWOVER) {
            overPoly = new google.maps.Polygon({
                paths: [
                    bounds.getSouthWest(),
                    new google.maps.LatLng(bounds.getSouthWest().lat(), bounds.getNorthEast().lng()),
                    bounds.getNorthEast(),
                    new google.maps.LatLng(bounds.getNorthEast().lat(), bounds.getSouthWest().lng())
                ],
                strokeColor: '#FF0000',
                strokeOpacity: 0.8,
                strokeWeight: 2,
                fillColor: '#FF0000',
                fillOpacity: 0.35,
                map: this.map
            });

            FacilityManager.SHOWOVER = true;
        }
    };

    // TODO: Split this out into two explicit functions with the
    // facilityType test moved up into the caller.  The two
    // functions would be:
    // - collectFacilities that only gathers all facilities contained in
    //   this.cache,
    // - hideFacilities that only hides all markers within this.cache
    //   and (if needed) resets focus.
    this.collectFacilities = function () {
        var facilities = [],
            isOff = typeof this.isOff !== 'undefined'
            cache = PimConfig.configParams.filter === 'street' ?
                this.blockCache : this.cache;

        if (isOff) {
            cache = this.cache;
        }

        // if active
        if (this.active) {
            facilities = $.map(cache, function (value) {
                return value;
            });

        // if loaded, but not active... then disable and hide
        } else if (!$.isEmptyObject(this.cache)) {
            // hideFacilities - close all pins and infobubbles
            $.each(this.cache, function (ignore, facility) {
                facility.marker.hideMarker();
            });
            MapPage.ppMap.closeAllInfoWindows();
        }
        return facilities;
    };
};

FacilityManager.testIsEmpty = function (sw, ne) {
    // Webmap starts as a 0 height box and then expands on load
    return (sw.lat() === ne.lat());
};

FacilityManager.getBboxString = function (bounds) {
    return [bounds.getSouthWest().lat(),
              bounds.getSouthWest().lng(),
              bounds.getNorthEast().lat(),
              bounds.getNorthEast().lng()].join('|');
};

/**
 * Filter list of facilities based on specified bounds.
 *
 * @param {google.maps.LatLngBounds} Bounds to filter on.
 * @param {array} List of Facility IDs to filter.
 * @returns {array} List of Facility IDs that are in bounds.
 */
FacilityManager.geoFilter = function (bounds, allFacilities) {
    var filteredFacilities = [];

    $.each(allFacilities, function () {
        // Choose between Google Maps or Mapbox marker bounds
        var markerLatLng = {
                lat: this.marker.mapMarker.getPosition().lat(),
                lng: this.marker.mapMarker.getPosition().lng()
            };

        var inBounds = FacilityManager.prototype.mapBoundsContains (
                bounds,
                markerLatLng.lat, markerLatLng.lng
            );

        // Remove facilitys that are outside of the specified bounds.
        if (inBounds) {
            filteredFacilities.push(this);
        }
    });

    return filteredFacilities;
};

/* Returns size of marker
    Currently this function is only used to determine at which zoom
    layer we switch to the tile layer.  However, it has legacy significance
    from back when we had different marker sizes */
FacilityManager.prototype.getMarkerSize = function () {
    // If on a destination page, don't show the zoom in message.
    // Otherwise show it if level 14 or greater when market
    // polygon or tiles show.
    var zoomLevel = PimConfig.MAP_TYPE === 'DESTINATION' ? 0 : 15;

    if (this.zoom >= zoomLevel) {
        return 48;
    }

    return 0;
};

FacilityManager.hideAllMarkers = function (cache) {
    $.each(cache, function () {
        this.marker.hideMarker();
    });
};

FacilityManager.prototype.mapBoundsContains = function (bounds, lat, lng) {
    return bounds.contains (
        new google.maps.LatLng(lat, lng)
    );
};

/**
 * Filter list of facilities based on zoom level
 *
 * @param {google.maps.LatLngBounds} Bounds to filter on.
 * @param {array} List of Facility IDs to filter.
 * @returns {array} List of Facility IDs that are in bounds.
 */
FacilityManager.zoomFilter = function (markerSize, allFacilities) {
    var filteredFacilities = [];

    $.each(allFacilities, function () {
        if (markerSize) {
            filteredFacilities.push(this);
        }
    });
    return filteredFacilities;
};

/**
 * Filter list of facilities based on reservable status
 *
 * @param {array} List of Facility IDs to filter.
 * @returns {array} List of Facility IDs that are in bounds.
 */
FacilityManager.reservableFilter = function (allFacilities) {

    var filteredFacilities = [];

    $.each(allFacilities, function () {

        // Remove facilitys that are outside of the specified bounds.
        if (Transactions.getDaily(this.attributes.reservations)) {
            filteredFacilities.push(this);
        }
    });
    return filteredFacilities;
};

/**
 * Filter list of facilities based on if it has rates
 *
 * @param {array} List of Facility IDs to filter.
 * @returns {array} List of Facility IDs that are in bounds.c
 */
FacilityManager.hasRatesFilter = function (allFacilities) {

    var filteredFacilities = [];

    $.each(allFacilities, function () {

        var attr = this.attributes;

        if (!Rates.isClosed(attr.isOpen, attr.invalidCost)) {
            filteredFacilities.push(this);
        }
    });
    return filteredFacilities;
};;
/* global google, Math, MarkerWithLabel, MapPage, PimColors, Rates, Transactions,
    PimConfig, PimUtil, Probability */

/* jshint browser:true, camelcase:false, devel:true, jquery:true */

'use strict';

var HOVEROFFSET = 80000;

var Marker = function () {

    // Core state that makes up a marker on the ParkMe map:
    // - Polygon for parking lot footprint or meter block side
    // - PEPs pointing to parking lot entrances
    // - Marker icon that points to polygon
    this.polygons = [];
    this.peps = [];
    this.mapMarker = null;

    // pin, polygon, and image
    this.myLotImage = {};

    this.initialize = function (reservations, map, polyData, position, PolyType, markerData, precision) {
        this.reservations = reservations;
        this.markerSize = markerData.markerSize;
        this.restricted = markerData.restricted;
        this.isOpen = markerData.isOpen;
        this.occupancy = markerData.occupancy || markerData.probability;
        this.rates = markerData.rates;
        this.cost = markerData.cost;
        this.invalidCost = markerData.invalidCost;
        this.imageURL = markerData.imageURL;
        this.dimensions = markerData.dimensions;
        this.facilityType = markerData.facilityType;

        // Most markers are bubbles.  The listManager at times
        // explicitly wants dots and will set this to false to do that.
        this.showBubble = true;

        // Create marker, label, polygons, and
        this.mapMarker = Marker.mapMarkerCreate(position);
        this.polygons = Marker.polygonsCreate(PolyType, polyData, precision || 5);
        this.peps = Marker.pepsCreate(markerData.peps);

        this.drawMarkers(markerData.currency, markerData.strokeWeight);

        // Place polygons on map
        this.polygonsShow(map);

        if (PimConfig.MAP_TYPE === 'LOTPAGE') {
            // Show the poly and pep on lotpage map.
            this.pepsShow(map);
            this.pepsUpdate();
        }

        // Attach event handlers
        google.maps.event.addListener(this.mapMarker, 'click', markerData.clickHandler);
        google.maps.event.addListener(this.mapMarker, 'mouseover', markerData.mouseoverHandler);
        google.maps.event.addListener(this.mapMarker, 'mouseout', markerData.mouseoutHandler);
        $.each(this.polygons, function () {
            google.maps.event.addListener(this, 'click', markerData.clickHandler);
            google.maps.event.addListener(this, 'mouseover', markerData.mouseoverHandler);
            google.maps.event.addListener(this, 'mouseout', markerData.mouseoutHandler);
        });

    };

    /** Set polygon color and stroke weight.
     *
     * @param {string} String encoded hexadecimal color
     * @param {number} Stroke weight for polygon
     */
    this.polygonsUpdate = function (strokeWeight) {
        var colorCode,
            colorName;

        if (this.facilityType === 'lot') {
          colorName = 'gray'
        } else if (MapPage.markerMode === 'occupancy') {
            colorName = Probability.getColorName(
                    this.isOpen, this.invalidCost, this.occupancy);
        }

        colorCode = PimColors.nameToCode(colorName);

        $.each(this.polygons, function () {
            this.setOptions({
                fillColor: colorCode,
                strokeColor: colorCode,
                strokeWeight: strokeWeight
            });
        });
    };

    /** Place all polygons on the specified map.
     *
     * @param {google.maps.Map} Map to put the polygons on.
     */
    this.polygonsShow = function (map) {
        $.each(this.polygons, function () {
            this.setMap(map);
        });
    };

    /** Remove all polygons from any map.
     */
    this.polygonsHide = function () {
        $.each(this.polygons, function () {
            this.setMap(null);
        });
    };

    /** Update size of PEPs.
     *
     * @param {number} New size of the PEP.
     */
    this.pepsUpdate = function () {
        var size = this.markerSize / 2;
        $.each(this.peps, function () {
            var icon;
            icon = this.getIcon();
            icon.scaledSize = new google.maps.Size(size, size);
            this.setIcon(icon);
        });
    };

    /** Place all PEPs on the specified map.
     *
     * @param {google.maps.Map} Map to put the PEPs on.
     */
    this.pepsShow = function (map) {
        $.each(this.peps, function () {
            this.setMap(map);
        });
    };

    /** Remove all PEPs from any map.
     */
    this.pepsHide = function () {
        $.each(this.peps, function () {
            this.setMap(null);
        });
    };

    /** Set image of marker pointing to facility based on requested color.
     *
     * @param {string} Name of color used to find image
     */
    this.mapMarkerUpdate = function (colorName) {
        var markerIcon,
            iconSize,
            payment = '';

        // Minimum icon size that we can support.
        iconSize = this.markerSize;
        if (iconSize < 48) {
            iconSize = 48;
        }

        // If daily parking and a reservable lot, show blue
        if (Transactions.getDaily(this.reservations)) {
            colorName = 'blue';
        }

        var restricted = '';
        // for now, since we only have one "restricted" marker, I need to make sure the color
        // is green.
        if ((this.restricted === 'Restricted' || this.restricted === 'Semi-Restricted') && colorName === 'green') {
            restricted = '_restricted';
        }

        // img found in webmap/img/circular_pins
        markerIcon = {
            'url': this.imageURL + payment + colorName + restricted + '.png',
            'anchor': this.dimensions[iconSize].o,
            'scaledSize': this.dimensions[iconSize].s
        };

        this.mapMarker.setIcon(markerIcon);
        return markerIcon;
    };

    /** Set map associated with the map marker and its label.
     *
     * @param {google.maps.Map} Map to put the PEPs on.
     */
    this.mapMarkerShow = function (map) {
        if (this.markerVisible) {
            this.mapMarker.setMap(map);
        }
    };

    /** Remove map marker/label from map.
     */
    this.mapMarkerHide = function () {
        this.mapMarker.setMap(null);
    };

    /** Update the label associated with a map marker
     *
     * @param {string} Text for the label
     */
    this.markerLabelUpdate = function (text) {
        // compute the markerSize for this marker
        var markerSize;
        markerSize = this.dimensions[this.markerSize];
        if (markerSize === undefined) {
            return;
        }
        this.mapMarker.labelAnchor =  markerSize.c;
        this.mapMarker.labelContent = text;
    };

    // Update marker data and redraw
    this.redrawPin = function (
            markerSize, visible, isOpen, cost, invalidCost, occupancy,
            currency, strokeWeight, map) {
        // Update internal state
        this.occupancy = occupancy;
        this.isOpen = isOpen;
        this.cost = cost;
        this.invalidCost = invalidCost;
        this.markerSize = markerSize;
        this.markerVisible = visible;

        // Redraw marker and lable
        this.drawMarkers(currency, strokeWeight);
    };

    // actually draws the marker
    this.drawMarkers = function (currency, strokeWeight) {
        var colorName,
            markerString;

        // Mode specific coloring and marker label
        if (MapPage.markerMode === 'occupancy') {
            colorName = Probability.getColorName(
                    this.isOpen, this.invalidCost, this.occupancy);
        } else {
            colorName = Rates.getColorName(
                    this.isOpen, this.invalidCost, this.cost, this.imageURL);
        }
        this.colorName = colorName;

        markerString = Rates.getCompactString(
                this.cost,
                this.isOpen,
                currency);

        // Hide label text if this is a dot rather than a bubble.
        if (!this.showBubble) {
            return;
        }

        // Update marker colors and label
        this.mapMarkerUpdate(colorName);
        this.markerLabelUpdate(markerString);
        this.polygonsUpdate(strokeWeight);
    };

    this.showMarker = function (street) {
        this.polygonsShow(MapPage.map);

        // Don't show markers for onstreet.
        if (!street) {
            this.mapMarkerShow(MapPage.map);
        }
    };

    this.hideMarker = function () {
        this.pepsHide();
        this.polygonsHide();
        this.mapMarkerHide();
    };
};

Marker.polyOpacity = function () {
    return 0.7;
};

// Mapping of statistics for display dots
//
// s: Image Size,
// o: Offset for the point at the bottom of the bubble
// c: Offset for the center of the bubble
// f: Font size for embedded label
Marker.DOT_DIMENSIONS = {
    48: {
        's': new google.maps.Size(18, 19),
        'o': new google.maps.Point(9, 18),
        'c': new google.maps.Point(0, 9),
        'f': ''
    }
};

/** Construct polygons from an array of polygon points.
 *
 * Create a set of geometries objects of type polyType using geometries
 * from polyDatas.  Created geometries are not attached to any map.
 *
 * @param {google.maps.Polygon|google.maps.Polyline} Geometry type that
 * is being created
 * @param {array} List of point geometries
 * @returns {array} List of geometry objects.
 */
Marker.polygonsCreate = function (PolyType, polyData, precision) {
    var polygons = [],
        filter = PimConfig.configParams.filter,
        polyOpacity = Marker.polyOpacity(filter);

    $.each(polyData, function () {
        var decodedPoints,
            polygon;

        decodedPoints = PimUtil.decodePolyline(this, precision).map(function(point) {
            return {
                lat: point[0],
                lng: point[1]
            };
        });
        polygon = new PolyType({
            fillOpacity: polyOpacity,
            path: decodedPoints,
            strokeOpacity: polyOpacity,
            geodesic: true
        });
        polygons.push(polygon);
    });
    return polygons;
};

/** Create arrows pointing to lot entry points.
 *
 * @param {array} List of objects describing PEP locations and azimuths.
 * @param {array} List of markers representing PEPs.
 */
Marker.pepsCreate = function (pepData) {
    var peps = [];
    $.each(pepData, function () {
        var arrowDirection,
            arrowIcon,
            arrowMarker;
        // If any information about the PEP is missing then skip this PEP.
        if (!this.pepPt || !this.pepAz) {
            return;
        }
        // Snap arrow direction to closest 30 degree angle with 0
        // degrees mapped to 0, 30 degrees mapped to 1, 60 degrees
        // mapped to 2, etc.
        arrowDirection = Math.floor(this.pepAz / 30);
        // Special case for 360 degrees.  There are a few of these
        // in the DB as of Dec. 2012.
        if (arrowDirection === 12) {
            arrowDirection = 0;
        }
        // Create marker.
        arrowIcon = {
            'anchor': new google.maps.Point(15.5, 15.5),
            'url': '/webmap/img/arrows/arrow_' + arrowDirection + '.png'
        };
        arrowMarker = new google.maps.Marker({
            'position': new google.maps.LatLng(this.pepPt[1], this.pepPt[0]),
            'icon': arrowIcon
        });
        peps.push(arrowMarker);
    });
    return peps;
};

/** Create marker pointing to facility.
 *
 * @param {google.maps.LatLng} Position for the marker.
 * @returns {google.maps.Marker} The marker.
 */
Marker.mapMarkerCreate = function (position) {
    var mapMarker;
    mapMarker = new MarkerWithLabel({
        position: position,
        optimized: false,    // required for overlapping - see comments in label.js for more details
        zIndex: 1,            // this is required to have the dots stay behind the pins
        labelClass: 'rate_label', // the CSS class for the label
    });
    mapMarker.setZIndex(HOVEROFFSET);
    HOVEROFFSET += 2;

    return mapMarker;
};
;
/* global PimConfig */
/* jshint browser:true, camelcase:false, devel:true, jquery:true */

(function () {
    'use strict';
})();

var Amenities = {

    iconList: {
        3: 'zipcar',
        4: 'Ev_station',
        5: 'carwash',
        6: 'shuttle',
        7: 'handicap',
        8: 'validated_parking',
        9: 'covered_parking',
        10: 'open_247',
        11: 'in_out_priveleges',
        12: 'printed_pass',
        13: 'unobstructed',
        14: 'parking_rvs',
        15: 'tailgating_permitted',
        16: 'restrooms',
        17: 'official',
        18: 'credit_cards_accepted',
        19: 'clearance',
        21: 'semi_parking',
        22: 'videomonitor',
        23: 'bicycle',
        24: 'elevator',
        25: 'lighting',
        26: 'payanddisplay',
        27: 'guidancesystem'
    },

    meterIconList:{
        1: 'free',
        2: 'cash_only',
        3: 'overnight',
        4: 'residential',
        5: 'semi_parking'
    },

    icons: function (amenities) {
        var amenitiesList = '',
            amenitiesImgBase = '/homepage/img/amenities/';

        if (!amenities) {
            return '';
        }

        // Loop through the amenities, add the description (name)
        // and the icon name to the img url.
        for (var i = 0; i < amenities.length; i += 1) {
            var amenityIcon = PimConfig.configParams.filter === 'street' ?
                Amenities.meterIconList[amenities[i].id] : Amenities.iconList[amenities[i].id]

            // Don't show the max width or max height (id === 1 and 2).
            if (amenityIcon !== undefined) {
                amenitiesList += '<img src="' + amenitiesImgBase + amenityIcon + '.png"' +
                    ' class="amenity-asset-city" title="' + amenities[i].name +
                    '" data-tooltip="' + amenities[i].name + '"/>';
            }
        }
        return amenitiesList;
    },

    /* Filter list of lot objects based
       on selected options in the <select> filter
       :param allFacilities - List of Lot objects
       :return filteredFacilities - List of Lot objects
    */
    amentiesFilter: function (allFacilities) {
        var filter = $('.filter-box:visible .list_filter_lots select').val() || [],
            filteredFacilities = [],
            amenityCount = {};

        // Loop through all the facilities, and return
        // only the ones that match the amenities filter.
        $.each(allFacilities, function () {
            var filterIndex,
                amenityList = [];

            // Create a flat list for each amenity
            $.each(this.attributes.amenities, function () {
                var id = this.id.toString();
                amenityCount[id] = (amenityCount[id] + 1) || 1;
                amenityList.push(id);
            });

            // Iterate through list of filters
            // If filters don't exists in amenity list, skip lot
            for (filterIndex = 0; filterIndex < filter.length; filterIndex += 1) {
                if (amenityList.indexOf(filter[filterIndex]) === -1) {
                    return true; // continue
                }
            }

            filteredFacilities.push(this);
        });

        Amenities.updateCounts(amenityCount);

        return filteredFacilities;
    },

    /* Update the on selected options in the <select> filter
       with count data from the API.
       Hides filters that are not in play
       :param amenityCount - Id/Count dictionary
    */
    updateCounts: function (amenityCount) {
        $('.filter-box:visible .list_filter_lots select > option').each(function () {
            var id = $(this).val(),
                count = amenityCount[id],
                newText;

            if (count) {
                newText = $(this).text().split('(')[0];
                newText = newText + ' (' + amenityCount[id] + ')';
                $(this).text(newText);
                $(this).prop('disabled', false);
            } else {
                $(this).prop('disabled', true);
            }
        });

        // Trigger update of list and redraw at proper width
        $('.filter-box:visible .list_filter_lots select').trigger('chosen:updated');
        $('.chosen-container-multi').find('input').width('100%');
    }
};
;
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/*global MapPage, OffSM, OnSM, Rates, Occupancy, FacilityManager, DRAG_END,
    PimConfig, PimUtil, Transactions, reSizeBody, gettext, ngettext, Amenities, Probability */

/*jshint multistr: true, jquery: true, camelcase: false, esversion: 6 */

var ListItem = function (_React$Component) {
    _inherits(ListItem, _React$Component);

    function ListItem(props) {
        _classCallCheck(this, ListItem);

        var _this = _possibleConstructorReturn(this, (ListItem.__proto__ || Object.getPrototypeOf(ListItem)).call(this, props));

        _this.handleClick = _this.handleClick.bind(_this);
        _this.handleHover = _this.handleHover.bind(_this);
        _this.handleHoverClear = _this.handleHoverClear.bind(_this);
        _this.occupancyBox = _this.occupancyBox.bind(_this);
        _this.calculateDistance = _this.calculateDistance.bind(_this);
        _this.reviews = _this.reviews.bind(_this);
        return _this;
    }

    _createClass(ListItem, [{
        key: 'handleClick',
        value: function handleClick() {
            var id = this.props.processedLot.attr.id || this.props.processedLot.attr.blockID,
                facility = PimConfig.configParams.filter === 'street' ? '/meter/' : '/lot/';

            PimUtil.recordAction('LotClick', id);
            if (MapPage.mobileWidth()) {
                window.location.href = facility + id + '/';
            } else {
                this.props.processedLot.lot.focus();
            }
        }
    }, {
        key: 'handleHover',
        value: function handleHover() {
            this.props.processedLot.lot.hover();
        }
    }, {
        key: 'handleHoverClear',
        value: function handleHoverClear() {
            this.props.processedLot.lot.hoverClear();
        }
    }, {
        key: 'occupancyBox',
        value: function occupancyBox() {
            var occupancyString,
                occupancyColor,
                occupancyObj = Occupancy,
                occOrProb = this.props.processedLot.attr.occupancy,
                isOpen = this.props.processedLot.attr.isOpen;

            if (PimConfig.configParams.filter === 'street') {
                occupancyObj = Probability;
                occOrProb = this.props.processedLot.attr.bucket;
                isOpen = this.props.processedLot.attr.segments[0].isOpen;
            }

            // Calculate how occupancy should be displayed
            occupancyString = occupancyObj.getCompactString(isOpen, this.props.processedLot.attr.invalidCost, occOrProb);

            occupancyColor = occupancyObj.getColorName(isOpen, this.props.processedLot.attr.invalidCost, occOrProb);

            if (occupancyString !== ' ') {
                // Render the colored occupancy box at bottom of the lot image.
                return React.createElement(
                    'div',
                    { className: "left occupancy-bar " + occupancyColor + "_bg" },
                    occupancyString
                );
            }

            return '';
        }
    }, {
        key: 'calculateDistance',
        value: function calculateDistance() {
            var distance = '',
                walkingTime,
                walkingTimeString,
                kmConversion;

            if (this.props.processedLot.attr.distance) {
                if (gettext('en') === 'en') {
                    walkingTime = Math.ceil(this.props.processedLot.attr.distance / 3 * 60);
                    walkingTimeString = walkingTime + ' ' + gettext('minute walk');
                    distance = React.createElement(
                        'div',
                        { className: 'fle_distance' },
                        this.props.processedLot.attr.distance + ' ' + ngettext('mile', 'miles', this.props.processedLot.attr.distance),
                        ' - ',
                        walkingTimeString
                    );
                } else {
                    kmConversion = (1.60934 * this.props.processedLot.attr.distance).toFixed(2);
                    walkingTime = Math.ceil(kmConversion / 5 * 60);
                    walkingTimeString = walkingTime + ' ' + gettext('minute walk');
                    distance = React.createElement(
                        'div',
                        { className: 'fle_distance' },
                        kmConversion + ' ' + ngettext('km', 'km', this.props.processedLot.attr.distance),
                        ' - ',
                        walkingTimeString
                    );
                }
            }

            return distance;
        }
    }, {
        key: 'reviews',
        value: function reviews(score) {
            var counter,
                reviews = [];

            if (score) {
                for (counter = 0; counter < score; counter++) {
                    reviews.push(React.createElement('span', { key: counter, className: 'review-star review-inline' }));
                }

                return React.createElement(
                    'div',
                    { className: 'center' },
                    React.createElement('br', { className: 'clear' }),
                    reviews
                );
            }
        }
    }, {
        key: 'render',
        value: function render() {
            var occ = this.occupancyBox(),
                title = this.props.processedLot.attr.title,
                subtitle = this.props.processedLot.attr.subtitle,
                distance = this.calculateDistance(),
                id = this.props.processedLot.attr.id || this.props.processedLot.attr.blockID,
                highLight = this.props.processedLot.highLight,
                amenityIcons = this.props.processedLot.amenityIcons,
                apiHtml = this.props.processedLot.apiHtml,
                seeDetailsBtn = this.props.processedLot.seeDetailsBtn,
                contextString = this.props.processedLot.contextString,
                thumbnail = this.props.processedLot.thumbnail,
                ctaBtn = function ctaBtn() {
                return apiHtml !== '' ? { __html: apiHtml } : { __html: seeDetailsBtn };
            };

            // Leaving in case we use reviews again.
            // reviews = this.reviews(this.props.processedLot.attr.review_score),

            return React.createElement(
                'div',
                {
                    id: id,
                    key: id,
                    className: 'featured_lot_entry' + highLight,
                    onClick: this.handleClick,
                    onMouseOver: this.handleHover,
                    onMouseOut: this.handleHoverClear
                },
                React.createElement(
                    'div',
                    { className: 'featured_lot_container' },
                    React.createElement(
                        'div',
                        { className: 'left fle_thumb' },
                        React.createElement(
                            'div',
                            null,
                            occ
                        )
                    ),
                    React.createElement(
                        'div',
                        { className: 'fle_left' },
                        React.createElement(
                            'div',
                            { className: 'fle_left' },
                            React.createElement(
                                'div',
                                { className: 'fle_lot_name' },
                                ' ',
                                title
                            )
                        ),
                        React.createElement(
                            'div',
                            { className: 'fle_left' },
                            React.createElement('div', { className: 'fle_lot_address',
                                dangerouslySetInnerHTML: { __html: subtitle } }),
                            React.createElement(
                                'div',
                                { className: 'gray' },
                                distance
                            )
                        ),
                        React.createElement('div', { className: 'fle_left list-lot-icons',
                            dangerouslySetInnerHTML: { __html: amenityIcons } })
                    ),
                    React.createElement(
                        'div',
                        { className: 'fle_right relative' },
                        React.createElement('div', { dangerouslySetInnerHTML: ctaBtn() }),
                        React.createElement(
                            'div',
                            null,
                            contextString
                        )
                    ),
                    React.createElement('div', { className: 'clear' })
                )
            );
        }
    }]);

    return ListItem;
}(React.Component);

var ListManager = function () {
    function ListManager() {
        _classCallCheck(this, ListManager);

        this.highLightClass = 'featured_lot_hover';

        this.drawMarkersOnMap = this.drawMarkersOnMap.bind(this);
        this.collectAndFilter = this.collectAndFilter.bind(this);
        this.drawWebViewMarkers = this.drawWebViewMarkers.bind(this);
        this.drawUpdateMarker = this.drawUpdateMarker.bind(this);
        this.sortReservable = this.sortReservable.bind(this);
        this.occupancySort = this.occupancySort.bind(this);
        this.transactionLink = this.transactionLink.bind(this);
        this.drawButtonSubheader = this.drawButtonSubheader.bind(this);
        this.drawLot = this.drawLot.bind(this);
        this.testHiddenLots = this.testHiddenLots.bind(this);
        this.redrawFeaturedLotsList = this.redrawFeaturedLotsList.bind(this);
        this.updateResultsDiv = this.updateResultsDiv.bind(this);
        this.noFeatureLotsMessage = this.noFeatureLotsMessage.bind(this);
        this.zoomInMessaging = this.zoomInMessaging.bind(this);
        this.highlightListItem = this.highlightListItem.bind(this);
        this.clearListItem = this.clearListItem.bind(this);
    }

    _createClass(ListManager, [{
        key: 'drawMarkersOnMap',
        value: function drawMarkersOnMap() {
            var mobileView = $(window).width() < 768,
                isDest = PimConfig.MAP_TYPE === 'DESTINATION',
                isLotPage = PimConfig.MAP_TYPE === 'LOTPAGE',
                isMobileWidget = PimConfig.MAP_TYPE === 'WIDGET' && mobileView,
                isReservable = PimConfig.configParams.filter === 'reserve',
                isMeters = PimConfig.configParams.filter === 'street',
                isOpboard = PimConfig.MAP_TYPE === 'OPBOARD',
                listFilter,
                facilities,
                filterTarget = '#desktop-filters',
                noListView = PimConfig.queryParse().listView && PimConfig.queryParse().listView === 'false',
                dontSkipFilter = !isLotPage && !noListView && !isMobileWidget && !isOpboard;

            if (mobileView) {
                filterTarget = '#mobile-filters';
            }

            listFilter = $(filterTarget + ' .lot-sort-box .list_sort').val();
            facilities = this.collectAndFilter();

            // If on the reserve filter but not destination page.
            if (isReservable && !isDest) {
                facilities.onMap = this.sortReservable(facilities.onMap);
            }

            // Don't run if on the lot page or widget map
            // doesn't show the list and filters.
            if (dontSkipFilter) {
                if (listFilter === 'popular') {
                    // Lots - filter by price by default
                    if (!isMeters) {
                        facilities.inBound = Amenities.amentiesFilter(facilities.onMap);
                        facilities.onMap = this.priceSort(facilities.inBound);
                        facilities.onMap = this.restrictedSort(facilities.onMap);
                        // Meters - filter by proximity by default
                    } else {
                        facilities.onMap = this.proximitySort(facilities.onMap);
                        facilities.onMap = this.noParkingSort(facilities.onMap);
                    }
                } else if (listFilter === 'price') {
                    facilities.inBound = Amenities.amentiesFilter(facilities.onMap);
                    facilities.onMap = this.priceSort(facilities.inBound);
                } else if (listFilter === 'distance') {
                    facilities.inBound = Amenities.amentiesFilter(facilities.onMap);
                    facilities.onMap = this.proximitySort(facilities.inBound);
                } else {
                    throw 'unrecognized filter';
                }
            }

            // draw markers based on standard web view or widget
            this.drawWebViewMarkers(facilities.all, facilities.inBound, facilities.onMap);

            // Update list
            if (document.getElementById('results')) {
                this.redrawFeaturedLotsList(facilities.onMap, facilities.onMap.length);
            }
        }
    }, {
        key: 'collectAndFilter',
        value: function collectAndFilter() {
            // Collect all Facilities and marker size
            var inBoundFacilities;
            var onMapFacilities;
            var remainingLots;
            var allFacilities;
            var markerSize = OffSM.getMarkerSize();

            // If showing meters, use OnSM.
            // Otherwise, use OffSM.
            if (PimConfig.configParams.showAll === true) {
                allFacilities = OnSM.collectFacilities().concat(OffSM.collectFacilities());
            } else if (PimConfig.configParams.filter === 'street') {
                // Clears the lot markers
                // when switching to meters.
                OffSM.collectFacilities();

                allFacilities = OnSM.collectFacilities();
            } else {
                allFacilities = OffSM.collectFacilities();
            }

            // Limit to in bounds facilities.
            inBoundFacilities = FacilityManager.geoFilter(MapPage.getPaddedViewBounds(), allFacilities);
            inBoundFacilities = FacilityManager.zoomFilter(markerSize, inBoundFacilities);

            // Don't process amenities if showing meters
            if (PimConfig.configParams.filter !== 'street') {
                inBoundFacilities = Amenities.amentiesFilter(inBoundFacilities);
            }

            // if guaranteed lots, widen the on-map view to padded view bounds
            // otherwise, show normal view bounds
            if (PimConfig.configParams.filter === 'reserve') {
                // If a destination page map is dragged, limit to inBoundFacilities.
                if (PimConfig.MAP_TYPE === 'DESTINATION' && DRAG_END) {
                    onMapFacilities = FacilityManager.reservableFilter(inBoundFacilities);
                } else {
                    onMapFacilities = FacilityManager.reservableFilter(allFacilities);
                }
            } else if (PimConfig.configParams.filter === 'monthly') {
                onMapFacilities = FacilityManager.hasRatesFilter(inBoundFacilities);
                remainingLots = FacilityManager.zoomFilter(markerSize, onMapFacilities);
            } else {
                onMapFacilities = FacilityManager.geoFilter(MapPage.map.getBounds(), inBoundFacilities);
                remainingLots = FacilityManager.zoomFilter(markerSize, onMapFacilities);
            }

            return {
                'all': allFacilities,
                'inBound': inBoundFacilities,
                'onMap': onMapFacilities
            };
        }
    }, {
        key: 'drawUpdateMarker',
        value: function drawUpdateMarker(allFacilities, notMeters, counter) {
            $.each(allFacilities, function (i, fac) {
                if (counter && fac.attributes.occupancy_dict !== undefined && counter in fac.attributes.occupancy_dict) {
                    fac.attributes.occupancy = fac.attributes.occupancy_dict[counter];
                    if (fac.attributes.occupancy_dict[counter]['is_open'] !== undefined) {
                        fac.attributes.isOpen = fac.attributes.occupancy_dict[counter].is_open;
                    }
                }

                if (PimConfig.configParams.filter !== 'reserve' && notMeters) {
                    if (this.visible) {
                        this.updateAndDrawMarker(MapPage.map);
                    } else {
                        this.marker.mapMarkerHide();
                    }
                } else if (notMeters) {
                    if (Transactions.getDaily(allFacilities[i].attributes.reservations) && this.visible) {
                        this.updateAndDrawMarker(MapPage.map);
                    } else {
                        this.marker.mapMarkerHide();
                    }
                } else if (this instanceof Meter) {
                    this.marker.showBubble = false;

                    // Hide bubbles for meters
                    this.marker.mapMarkerHide();
                } else if (this instanceof Lot) {
                    if (this.visible) {
                        this.updateAndDrawMarker(MapPage.map);
                    } else {
                        this.marker.mapMarkerHide();
                    }
                }
            });
        }

        /**
         * Render facilities for standard Web View
         *
         * @param {array} List of facilities.
         * @returns none allFacilities object is edited by reference.
         */

    }, {
        key: 'drawWebViewMarkers',
        value: function drawWebViewMarkers(allFacilities, inBoundFacilities, onMapFacilities) {
            // NOTE: Creating a Facility.visible member.  Used to track if the
            // facility is visible or not.  Only used within this small chunk of
            // code.  Ideally, re-write this to not modify the Facility objects.

            var i,
                count = 0,
                notMeters = PimConfig.configParams.filter !== 'street',
                delay = notMeters ? 1000 : 2500;

            // Reset marker visibility status for all known facilities.
            $.each(allFacilities, function () {
                this.visible = false;
            });

            // Set marker visibility status for in bounds facilities.  Note that
            // we draw ALL in bounds facilities, some of them with pins and some
            // with dots.
            $.each(inBoundFacilities, function () {
                this.visible = true;
                this.marker.showBubble = PimConfig.configParams.onlyPins; // defaults to false
            });

            // Set which lots should be drawn using a bubble and which should be
            // drawn as a small dot.
            for (i = 0; i < onMapFacilities.length; i += 1) {
                if (i < onMapFacilities.length && onMapFacilities[i] instanceof Lot && count < PimConfig.PINS_TO_DRAW) {

                    // Show bubble
                    onMapFacilities[i].marker.showBubble = true;
                    count = count + 1;
                }
            }

            // Redraw everything that is within the map bounds
            // filter guaranteed lots if selected
            // NOTE: Its important that we draw in REVERSE order
            // so that dots don't overlap with pins (dots drawn first, pins after)
            if (MapPage.occupancySlider && MapPage.occupancySlider.animateClicked) {
                MapPage.occupancyInterval.call(this, allFacilities, notMeters, delay);
            } else {
                this.drawUpdateMarker(allFacilities, notMeters, null);
            }
        }
    }, {
        key: 'restrictedSort',
        value: function restrictedSort(inBoundFacilities) {

            inBoundFacilities.sort(function (first, second) {
                if (first.attributes.type === second.attributes.type) {
                    return 0;
                } else if (first.attributes.type === 'Restricted') {
                    return 1;
                } else if (second.attributes.type === 'Restricted') {
                    return -1;
                }
                return 0;
            });

            return inBoundFacilities;
        }

        /**
         * Generate list of visible and list of hidden facilities.
         *
         * @param {array} List of facility IDs to collide.
         * @returns {array} List of facility IDs to show after collision.
         */

    }, {
        key: 'priceSort',
        value: function priceSort(inBoundFacilities) {

            inBoundFacilities.sort(function (first, second) {
                if (first.attributes.cost === null && second.attributes.cost === null) {
                    return 0;
                } else if (first.attributes.cost === null) {
                    return 1;
                } else if (second.attributes.cost === null) {
                    return -1;
                }

                return first.attributes.cost - second.attributes.cost;
            });

            return inBoundFacilities;
        }

        /**
         * Sort ONSTREET (doesn't work for offstreet)
         * Based on whether block is parkable or not
         * @param {array} List of facility IDs to collide.
         * @returns {array} List of facility IDs to show after collision.
         */

    }, {
        key: 'noParkingSort',
        value: function noParkingSort(onMapFacilities) {
            var facilities = onMapFacilities;
            facilities.sort(function (first, second) {
                return second.attributes.segments[0].isOpen - first.attributes.segments[0].isOpen;
            });
            return facilities;
        }
    }, {
        key: 'proximitySort',
        value: function proximitySort(onMapFacilities) {
            var facilities = onMapFacilities;

            // sort non-reservable lots by distance
            facilities.sort(function (first, second) {

                return first.attributes.distance - second.attributes.distance;
            });

            return facilities;
        }
    }, {
        key: 'sortReservable',
        value: function sortReservable(onMapFacilities) {
            var facilities = onMapFacilities;

            // sort reservable lots by distance
            facilities.sort(function (first, second) {

                var a = Transactions.getDaily(first.attributes.reservations) === null,
                    b = Transactions.getDaily(second.attributes.reservations) === null;

                // Fallback to price sort
                if (a === b) {
                    if (first.attributes.cost === null && second.attributes.cost === null) {
                        return 0;
                    } else if (first.attributes.cost === null) {
                        return 1;
                    } else if (second.attributes.cost === null) {
                        return -1;
                    }

                    return first.attributes.cost - second.attributes.cost;
                }

                return a - b;
            });

            return facilities;
        }

        /**
         * Generate list of visible and list of hidden facilities.
         *
         * @param {array} List of facility IDs to collide.
         * @returns {array} List of facility IDs to show after collision.
         */

    }, {
        key: 'occupancySort',
        value: function occupancySort(inBoundFacilities) {
            inBoundFacilities.sort(function (first, second) {

                return Occupancy.getWeight(first) - Occupancy.getWeight(second);
            });

            return inBoundFacilities;
        }

        // Get the trasaction link
        // See peer in InfoWindow.js

    }, {
        key: 'transactionLink',
        value: function transactionLink(name, reservations, rateString, id) {
            var compareBtn = Transactions.drawButton(name, reservations, rateString, id);

            return compareBtn;
        }
    }, {
        key: 'drawButtonSubheader',
        value: function drawButtonSubheader(text) {
            var webmapcontextString = '';

            if (PimConfig.MAP_TYPE === 'WIDGET') {
                return '';
            } else if (PimConfig.MAP_TYPE === 'DESKTOP') {
                webmapcontextString = 'webmap-reservable-text';
            }

            return React.createElement(
                'div',
                { className: "reservable-text uppercase " + webmapcontextString },
                text
            );
        }
    }, {
        key: 'drawLot',
        value: function drawLot(lot) {
            var rateString,
                highLight = '',
                apiHtml = '',
                seeDetailsBtn = '',
                amenityIcons = '',
                thumbnail,
                contextString = '',
                attr = lot.attributes;

            if (PimConfig.configParams.filter === 'street' || PimConfig.MAP_TYPE === 'LOTPAGE') {
                thumbnail = attr.photoThumbs[0];
            } else {
                thumbnail = lot.attributes.photos[0].thumbnail;
            }

            // Format string displaying cost to park
            rateString = Rates.getString(attr.cost, attr.isOpen, attr.currency);

            // If a reservation btn exists, render it instead of the See Details button + rate string (if available).
            // Otherwise, render the See Details button + rate string (if available).
            if (this.transactionLink(attr.title, attr.reservations, rateString) !== '') {
                // If the reserve button is not an empty string (exists), render the reserve button + dropdown.
                apiHtml = this.transactionLink(attr.title, attr.reservations, rateString, attr.id);
            } else {
                seeDetailsBtn = Transactions.seeDetails(rateString, attr.id, attr.blockID);
            }

            contextString = Rates.getRateContext(attr);
            if (contextString) {
                contextString = this.drawButtonSubheader(contextString);
            }

            // Render the amenities icons.
            amenityIcons = Amenities.icons(attr.amenities, attr.pmtTypes);

            // If lot is still focused after list clear, then highlight again
            if (lot.focused) {
                highLight = ' ' + this.highLightClass;
            }

            return {
                rateString: rateString,
                highLight: highLight,
                apiHtml: apiHtml,
                seeDetailsBtn: seeDetailsBtn,
                amenityIcons: amenityIcons,
                thumbnail: thumbnail,
                contextString: contextString,
                attr: attr,
                lot: lot
            };
        }
    }, {
        key: 'redrawFeaturedLotsList',
        value: function redrawFeaturedLotsList(featuredLots) {
            var _this2 = this;

            var hiddenEvents = false,
                listHTML = void 0;

            // Continue by redrawing the featured lots or
            //  no lots found message
            if (OffSM.getMarkerSize() === 0) {
                this.zoomInMessaging();
                return;
            } else if (PimConfig.MAP_TYPE !== 'DESTINATION' && PimConfig.MAP_TYPE !== 'LOTPAGE' && !OnSM.active && featuredLots.length <= 0) {

                this.noFeatureLotsMessage();
                return;
            }

            // Show or hide the Show more/fewer lots link.
            if (hiddenEvents) {
                $('#show_more_lots').show();
            } else {
                $('#show_more_lots').hide();
            }

            listHTML = React.createElement(
                'div',
                null,
                featuredLots.map(function (lot, i) {
                    var processedLot = _this2.drawLot(lot);

                    // Limit meters in webmap list to 20,
                    // destination map to 5, and keep the pins the same.
                    if (PimConfig.configParams.filter === 'street' && i > 19) {
                        return;
                    } else if (PimConfig.MAP_TYPE === 'DESTINATION' && i > 14) {
                        return;
                    } else {
                        // If there are more than 10 events, hide them.
                        if (_this2.testHiddenLots(i)) {
                            $(_this2).addClass('hide');
                            hiddenEvents = true;
                        }
                    }

                    return React.createElement(
                        'div',
                        { key: i },
                        React.createElement(ListItem, {
                            processedLot: processedLot
                        })
                    );
                })
            );

            this.updateResultsDiv(listHTML);
        }
    }, {
        key: 'testHiddenLots',
        value: function testHiddenLots(i) {
            if (i > 4 && i < 15) {
                return true;
            }
        }

        /* Removes the old message/list and updates with new list */

    }, {
        key: 'updateResultsDiv',
        value: function updateResultsDiv(results) {
            var featured = React.createElement(
                'div',
                { className: 'offstreetLot_featu' },
                results
            );

            // Put the html into the results container.
            if (results && document.getElementById('results')) {
                ReactDOM.render(featured, document.getElementById('results'));
            }
        }
    }, {
        key: 'noFeatureLotsMessage',
        value: function noFeatureLotsMessage() {
            // Updates left column with a message if there are no featured lots
            var message = React.createElement(
                'div',
                { className: 'featured_lot_entry fle_zoom_in_msg' },
                'We can\'t seem to \uFB01nd any matching parking nearby. That doesn\'t mean there\'s no parking here, we just don\'t have recent data for this area.',
                React.createElement('br', null),
                React.createElement('br', null),
                'Try changing the filter or searching a different area.',
                React.createElement('br', null),
                React.createElement('br', null),
                'We offer data on millions of parking locations in every country in the world!'
            );

            this.updateResultsDiv(message);
        }

        // Updates left column with a message if offstreet parking is selected,
        // but too zoomed out to see lots.

    }, {
        key: 'zoomInMessaging',
        value: function zoomInMessaging() {
            var message = React.createElement(
                'div',
                { className: 'featured_lot_entry fle_zoom_in_msg' },
                React.createElement(
                    'center',
                    { className: 'gray' },
                    React.createElement('img', { className: 'toggle_lots',
                        src: '/webmap/img/icon-zoomLimitAlert.png' }),
                    React.createElement('br', null),
                    React.createElement('br', null),
                    gettext('Zoom in closer to see individual lots and pricing')
                )
            );

            this.updateResultsDiv(message);
        }
    }, {
        key: 'addRemoveClasses',
        value: function addRemoveClasses(id, method) {
            var selector = document.querySelector('.featured_lot_entry[id="' + id + '"], ' + '.module-event-lot[id="' + id + '"]');

            // Prevents error if viewing specific lot.
            if (selector) {
                selector.classList[method](this.highLightClass);
            }
        }

        // Adds the highlighted class to the standard lot list
        // and the nearby lots widget list (on marker hover).

    }, {
        key: 'highlightListItem',
        value: function highlightListItem(id) {
            this.addRemoveClasses(id, 'add');
        }
    }, {
        key: 'clearListItem',
        value: function clearListItem(id) {
            this.addRemoveClasses(id, 'remove');
        }
    }]);

    return ListManager;
}();

ListManager = new ListManager();

// We attach a listener to the redraw map event
// This event is called on significant map move or zoom event
// There is also a listener on the collision manager
MapPage.customEvents.addEventlistener('redraw_list', function () {
    ListManager.drawMarkersOnMap();
});
;
/* global PimUtil, PimConfig, Rates, Occupancy, gettext, Transactions, dateParam */
/* global $, OnSM, OffSM, ngettext, Probability, MapPage */

/* jshint browser:true, camelcase:false, devel:true, jquery:true */

'use strict';

var InfoWindow = {},
    thisCache;

// If attr.distance exists (can parse), add ' Miles'.
// Otherwise make it an empty string (for meters).
// Done outside of facility.js so it doesn't interfere with
// distance sorting in listManager.js.
InfoWindow.distanceString = function (dist) {

    var distance = '';
    if (isNaN(parseFloat(dist))) {
        distance = dist;
    }
    else {
        if (gettext('en') === 'en') {
            distance = dist + ' ' + ngettext('Mile', 'Miles', dist);
        } else {
            distance = (1.60934 * dist).toFixed(2) + ' ' + ngettext('km', 'km', dist);
        }
    }
    return distance;
};

InfoWindow.getHover = function (attr, colorName) {

    var headerString = '',
        rateString,
        isOpen = attr.segments ?
                attr.segments[0].isOpen : attr.isOpen;

    rateString = Rates.getString(
        attr.cost,
        isOpen,
        attr.currency
    );

    if (Transactions.getDaily(attr.reservations)) {
        headerString = '<div class="reservable">' + gettext('Reserve A Spot Here') + '</div>';
    }

    return '<div class="infobubble">' + headerString +
                '<div class="section">' +
                    '<div class="section-header">' +
                        '<div class="section-header-name left">' + attr.title + '</div>' +
                        '<div class="' + colorName + ' right">' + rateString + '</div>' +
                        '<div class="clear"></div>' +
                    '</div>' +
                    '<div class="section-subheader">' +
                        '<div class="left">' + attr.subtitle + '</div>' +
                        '<div class="right">' + InfoWindow.distanceString(attr.distance) + '</div>' +
                        '<div class="clear"></div>' +
                    '</div>' +
                '</div>' +
                InfoWindow.addlInfo(attr) +
            '</div>';

};

InfoWindow.getMobile = function (attr, colorName) {

    var headerString = '',
        rateString,
        content,
        id = attr.id || attr.m_id,
        isOpen = attr.segments ?
                attr.segments[0].isOpen : attr.isOpen;

    rateString = Rates.getString(
        attr.cost,
        isOpen,
        attr.currency
    );

    if (Transactions.getDaily(attr.reservations)) {
        headerString = '<div class="infobubble-reservable">' + gettext('Reserve A Spot Here') + '</div>';
    }

    content = headerString + '<div class="infobubble infobubble-mobile">' +
                '<div class="section">' +
                    '<div class="section-header">' +
                        '<div class="section-header-name left">' + attr.title + '</div>' +
                        '<div class="' + colorName + ' right">' + rateString + '</div>' +
                        '<div class="clear"></div>' +
                    '</div>' +
                    '<div class="section-subheader">' +
                        '<div class="left">' + attr.subtitle + '</div>' +
                        '<div class="right">' + InfoWindow.distanceString(attr.distance) + '</div>' +
                        '<div class="clear"></div>' +
                    '</div>' +
                '</div>' +
                InfoWindow.addlInfo(attr) +
            '</div>';

    return InfoWindow.selfLink(id, attr.hasOwnProperty('segmentID') , attr.url, content);
};

InfoWindow.getFull = function (attr, colorName, maxRateRows) {

    var rateString,
        hoursAndRates = attr.rateCard || '',
        image = '',
        imageClass = '',
        isBlock = attr.m_id !== undefined,
        isSegment = attr.segmentID !== undefined,
        thisId = isSegment ?
                attr.segmentID + '-' + attr.m_id :
                attr.id || attr.blockID,
        isOpen = attr.segments ?
                attr.segments[0].isOpen : attr.isOpen;

    rateString = Rates.getString(
        attr.cost,
        isOpen,
        attr.currency
    );

    return '<div class="infobubble" data-f-id="' + thisId + '">' +
                '<div class="section">' +
                    '' + image + '' +
                    '<div class="left">' +
                        '<div class="section-header section-header-name' + imageClass + '">' +
                            '' + attr.title + '' +
                        '</div>' +
                        '<div class="section-subheader">' + attr.subtitle + '</div>' +
                    '</div>' +
                    '<div class=" right">' +
                       '<div class="section-header  ' + colorName + ' ">' + rateString + '</div>' +
                       '<div class="section-subheader">' + InfoWindow.distanceString(attr.distance) + '</div>' +
                    '</div>' +
                    '<div class="clear"></div>' +
                '</div>' +
                InfoWindow.ratehoursTable(hoursAndRates, thisId, isBlock, isSegment, maxRateRows) +
                InfoWindow.addlInfo(attr) +
                '<div class="section">' +
                     '<div class="section-bottom">' +
                        InfoWindow.transactionLink(attr) +
                        '<div class="clear"></div>' +
                    '</div>' +
                '</div>' +
            '</div>';
};

InfoWindow.addlInfo = function (attr) {
    var contextString,
        occupancyString = '',
        creditCards = '',
        middleDot = '',
        occOrProb = Occupancy,
        isOpen = attr.segments ?
                attr.segments[0].isOpen : attr.isOpen;

    if (PimConfig.configParams.filter === 'street') {
        occOrProb = Probability;
    }

    // Occupancy/probability string
    occupancyString = occOrProb.getString(
        isOpen,
        attr.invalidCost,
        attr.occupancy || attr.bucket
    );

    // Standard Case - 80% Full -- Credit Cards Accepted

    // Special Case Context
    contextString = Rates.getRateContext(attr.invalidCost, isOpen, attr.hrs, attr.type);

    if (contextString) {
        return '<div class="section"><div class="section-information">' +
            contextString + '</div></div>';
    }

    // credit card string
    if ($.inArray('MC/Visa', attr.pmtTypes) !== -1 ||
            $.inArray('Amex', attr.pmtTypes) !== -1 ||
            $.inArray('Discover', attr.pmtTypes) !== -1) {

        creditCards = gettext('Credit Cards Accepted');

    }

    // middledot
    if (occupancyString && creditCards) {
        middleDot = ' &middot; ';
    } else if (!occupancyString && !creditCards) {
        return '';
    }

    return '<div class="section"><div class="section-information">' +
        occupancyString + middleDot + creditCards + '</div></div>';
};


/* Formats rates and hours into a table with max rows n */
InfoWindow.ratehoursTable = function (rates, thisId, isBlock, isSegment, maxRows) {
    var output = '';

    if (Rates.testInvalidRates(rates)) {
        return '';
    } else if (maxRows === null) {
        maxRows = 100;
    }

    // Core table
    $.each(rates.slice(0, maxRows), function () {
        var rate_text,
            rate_big_text,
            rate_small_text,
            // Grabs the value after the last ': ' ('Free', '$1.00', etc).
            rate_amount = this.substring(this.lastIndexOf(': ') + 1);

        // We need a space after the colon so we don't split times.
        // example: Rates reset at 4:15pm
        // Gets everything from the beginning of the
        // string to the last ': '.
        rate_text = this.substring(0, this.lastIndexOf(': '));

        // If there's no '(' in the string...
        if (this.indexOf('(') === -1) {
            rate_big_text = rate_text; // The big text on the left.
            rate_small_text = ''; // The small text below big text.
        } else {
            rate_text = rate_text.split(/(.*?)\((.*?)\)/g);
            rate_big_text = $.trim(rate_text[1]);
            rate_small_text = '<div class="section-content-small">' +
                                $.trim(rate_text[2]) + '</div>';

            // If the third item in the array is not an empty string,
            // Split the sting on line break.
            // Otherwise, use the trimmed string as the rate value on the right.
            if (rate_text[3] !== '') {
                rate_amount = rate_text[3].split('\n');
                rate_amount = rate_amount[0].split(': ')[1].trim();
            } // Else, uses the default value for rate_amount.
        }

        // Format the big text on the left.
        rate_big_text = rate_big_text.replace(/[0]?([0-9]*?).5 ([hH])/, '$1&#189; $2');

        // Create the rates section div.
        output += '<div class="section-content">' +
                        '<div class="left">' + rate_big_text + rate_small_text + '</div>' +
                        '<div class="right">' + rate_amount + ' </div>' +
                        '<div class="clear"></div>' +
                    '</div>';
    });

    // If not a unit test, switch the on/offstreet
    // manager based on type (lot or meter).
    if (isBlock !== 'test') {
        if (isSegment) {
            // WARNING - GLOBAL VAR: thisCache
            thisCache = OnSM.cache[thisId];
        } else if (isBlock) {
            thisCache = OnSM.blockCache[thisId];
        } else {
            thisCache = OffSM.cache[thisId];
        }
    }

    // More button
    if ($.isArray(rates) && rates.length > maxRows) {
        output += '<div class="section-content">'+
                        '<a onclick="thisCache.expand();"'+
                                'class="small right">'+
                            '' + gettext('More') + '...</a>'+
                        '<div class="clear"></div>'+
                    '</div>';
    }

    return '<div class="section">' + output + '</div>';

};

/* Wraps content in a link back to the lot page
   If fullsize is selected, loads the lot page via ajax */
InfoWindow.selfLink = function (id, isBlock, url, content, testDate) {
    var type = '/lot/',
        entryDate = '',
        location = '',
        date = {},
        thisDateParam;

    // If a meter
    if (isBlock) {
        type = '/meter/';
    }

    // If on a destination page...
    if (PimConfig.MAP_TYPE === 'DESTINATION') {
        // Extract the location string from the url.
        location = url.split(id);
        location = location[1];

        // If NOT part of a unit test,
        // use the date from the datepicker.
        if (testDate === undefined) {
            entryDate = '?entry-date=' + PimUtil.ISODateFormat(MapPage.timeSlider.startTime);
            entryDate = entryDate + '&duration=' + MapPage.timeSlider.duration;
        } else {
            date.date = testDate;

            // Get the entry date from the
            // function in nearbyLots.js.
            thisDateParam = dateParam(date);

            entryDate = '?' + $.param(thisDateParam);
        }
    }

    // If a lot, use /lot/ and lot id.
    // Otherwise, use /meter/ and meter id.
    // Adds the location and entry date to the href.
    return '<a href="' + PimUtil.getVirtualHost('www') + type +
            id + location + entryDate + '" target="_blank">' + content + '</a>';
};

InfoWindow.moreInfo = function (hasDetailsPage, id, meterID,blockID) {

    if (hasDetailsPage && id) {
        return '/lot/' + id;
    }
    else if (hasDetailsPage && meterID) {
        return '/meter/' + meterID;
    }
    else if(hasDetailsPage && blockID)
        return '/meter/' + blockID

    return '';
};

// Get the trasaction link
InfoWindow.transactionLink = function (attr) {

    /* Note: On the webmap, daily/monthly are exclusive, so order doesn't matter.
    However, on the widget, we give preference to Monthly over daily parking.
    This is to satisfy a requirement from Colonial.  Our only daily/monthly
    partner at this time.*/

    var res = Transactions.getMonthly(attr.reservations) || Transactions.getDaily(attr.reservations);
    var linkText = gettext('Reserve a Spot'),
    targetBlank = '',
    detailsLink = '',
    detailsHref;

    // Show See Details and take users to the lotpage if it's
    // not monthly, not reservable or exclusively affiliate.
    if (!res || res.source !== 'ParkMe' && !res.monthly || res.source === "Colonial Monthly") {
        res = {};

        // Sets the link to the lot or meter page.
        res.link = InfoWindow.moreInfo(attr.detailPage, attr.id, attr.m_id, attr.blockID);
        linkText = gettext('See Details');
    } else if (res.monthly) {
        linkText = gettext('Apply for Monthly');

        // Renders details button to take you to the lot page.
        detailsHref = InfoWindow.moreInfo(attr.detailPage, attr.id, attr.m_id, attr.blockID);
        detailsLink = '<a class="right"' + targetBlank + ' rel="nofollow" href="' +
                        Transactions.hrefLink(detailsHref) + '">' + gettext('See Details') + '</a>';
        targetBlank = ' target="_blank"';
    }

    // Prevents bug in PWS-824 - ASG Park widget
    if (PimConfig.MAP_TYPE === 'WIDGET') {
        targetBlank = ' target="_blank"';
    }
    // See Details or Reserve a Spot link.
    return '<a class="left"' + targetBlank + ' rel="nofollow" href="' +
        Transactions.hrefLink(res.link) + '">' + linkText + '</a>' +
        detailsLink;
};
;
/* Handles Lot specifc data such as marker details,
   data cleaning, InfoWindows, etc.

   Requires: Facility, InfoWindow
*/

/* global Facility, google, Marker, Transactions, PimConfig, PimUtil, $ */

/* jshint browser:true, camelcase:false, devel:true, jquery:true */

'use strict';

var Lot = function () {};

Lot.prototype = new Facility();

// Mapping of statistics about markers used for off street lots.
//
// s: Image Size,
// o: Offset for the point at the bottom of the bubble
// c: Offset for the center of the bubble
// f: Font size for embedded label
try {
    Lot.prototype.MARKER_DIMENSIONS = {
        48: {
            's': new google.maps.Size(50, 63),   // Marker Size
            'o': new google.maps.Point(25, 65),  // Marker Icon Offset
            'c': new google.maps.Point(17, 46),  // Rate Label Offset
            'l': new google.maps.Point(-5, -1),  // Occupancy Label Offset
            'f': '17px'
        }
    };
} catch (e) {
    console.log('Bypassing lot marker dimensions');
}

Lot.prototype.getPolygonAndLatLng = function (attr) {
    return {
        newLatLng: new google.maps.LatLng(attr.lat, attr.lng),
        newPolygon: google.maps.Polygon
    };
};

Lot.prototype.initialize = function (map, attributes, markerSize) {
    var thisLot = this,
        latLngPoly;

    // Initialize core lot data.
    this.map = map;
    this.markerSize = markerSize;

    // Clean attributes
    this.attributes = this.cleanAttributes(attributes);

    // Using cleaned attributes, get the new lat/lng and polygon
    latLngPoly = Lot.prototype.getPolygonAndLatLng(this.attributes);

    // Construct marker for the lot.
    this.marker = new Marker();
    this.marker.initialize(
        this.attributes.reservations,
        this.map,
        this.attributes.ppoly_arr,
        latLngPoly.newLatLng,
        latLngPoly.newPolygon,
        {
            drawPolys: false,
            markerSize: markerSize,
            restricted: this.attributes.type,
            strokeWeight: this.getStroke(),
            isOpen: this.attributes.isOpen,
            occupancy: (this.attributes.occupancy),
            occupancy_dict: (this.attributes.occupancy_dict),
            cost: this.attributes.cost,
            invalidCost: this.attributes.invalidCost,
            peps: this.attributes.peps,
            imageURL: '/webmap/img/circular_pins/' + this.attributes.pin_type,
            dimensions: this.MARKER_DIMENSIONS,
            currency: this.attributes.currency,
            facilityType: 'lot',
            clickHandler: function () {
                PimUtil.recordAction('LotClick', thisLot.attributes.id);
                thisLot.focus(thisLot.attributes.id);

                // Init occupancy for occ modal (Mapbox only)
                Lot.prototype.occupancyInit(thisLot.attributes.id);
            },
            mouseoverHandler: function () {
                thisLot.hover();
            },
            mouseoutHandler: function () {
                thisLot.hoverClear();
            }
        }
    );
};

// Empty function; used for Mapbox
Lot.prototype.occupancyInit = function () {};

// Handle setting of intelligent defaults (typically null) for
// missing data and perform some very basic data clean up.
Lot.prototype.cleanAttributes = function (attributes) {

    // Equivalent of a super call
    attributes = Facility.prototype.cleanAttributes.call(this, attributes);

    // Is there a detail page for this class?
    attributes.detailPage = true;

    // lat and lng of either points or points.coordinates (global LOTS)
    if (typeof(attributes.point.coordinates) !== 'undefined') {
        // Global LOTS
        attributes.lat = attributes.point.coordinates[1];
        attributes.lng = attributes.point.coordinates[0];
    } else {
        // AJAX lots
        attributes.lat = attributes.point[1];
        attributes.lng = attributes.point[0];
    }

    // Clean tapis
    // Don't show transaction pins for monthly
    attributes.pin_type = '';

    // clean polygon
    if (!$.isArray(attributes.ppoly_arr)) {
        if (attributes.polygon) {
            attributes.ppoly_arr = [attributes.polygon];
        } else {
            attributes.ppoly_arr = [];
        }
    }

    // clean permit only
    if (attributes.type === 'Permit Only') {
        attributes.cost = null;
        attributes.invalidCost = false;

        // Prioritize a reservable pin if lot is both
        // permit and reservable
        if (!Transactions.getDaily(attributes.reservations)) {
            attributes.pin_type = 'permit-';
        }
    }

    // Commented this out in attempt to fix -- TypeError: Unable to delete property.
    // delete attributes.calculatedRates;
    attributes.calculatedRates = null;

    return attributes;
};

// Lot's always have a stroke of zero
Lot.prototype.getStroke = function () {
    return 0;
};

Lot.getPois = function (pk_lot) {
    $.get("/lot_pois/", { 'pk_lot': pk_lot }, function (data) {
        $('#pois_tab').html(data);

        $("#btnLeft").click(function () {
            var unselectedItems = $("#poi_to_unlink option:selected");
            $("#poi_to_select").append(unselectedItems);

            Lot.addRemovePois('DELETE', unselectedItems);
        });

        $("#btnRight").click(function () {
            var selectedItems = $("#poi_to_select option:selected");
            $("#poi_to_unlink").append(selectedItems);

            Lot.addRemovePois('POST', selectedItems);
        });
    });
};

Lot.addRemovePois = function (r_type, pois) {
    var arr = [];
    pois.each(function () {
        arr.push(this.value);
    });

    $.ajax({
        url: '/lot_pois/',
        type: 'POST',
        data: { 'r_type': r_type, 'pk_lot': current_lot.pk_lot, 'pois': JSON.stringify(arr) },
        dataType: 'json',
        success: function (data) {
            console.log(data)
        }
    });
};
;
/* global google, log, MapPage, PimUtil, PimConfig, FacilityManager, $, Lot, MONTHLY_LAYER,
    turfContains */

/* jshint browser:true, camelcase:false, devel:true, jquery:true */

'use strict';

/*
   Handles Lot events such as zoom and map move, as well as
   API calls and caching.
   Requires: FacilityManager and Lot
*/

var OffStreetManager = function () {};

OffStreetManager.prototype = new FacilityManager();

OffStreetManager.prototype.active = true;
OffStreetManager.prototype.recentLots = [];
OffStreetManager.prototype.URL = '/lots';
OffStreetManager.prototype.limit = 250;

OffStreetManager.prototype.handleData = function (response) {
    var inBoundFacilities = response.result,
        thisManager = this,
        contains;

    // reset recent lots
    thisManager.recentLots = [];

    // update the timezone for the map
    if (MapPage.timeSlider) {
        MapPage.timeSlider.updateTimeZone(response);
    }

    // Add to cache or update each lot described in response.
    $.each(inBoundFacilities, function () {
        var cachedLot,
            lot,
            rateType = 'L',
            rateCost = this.daily_rate,
            lotAttribues;

        if (PimConfig.MAP_TYPE === 'LOTPAGE') {
            // Assign attributes to LOT object.
            this.attributes = {
                address: this.address
            };
        }

        // Add the calculated_rates attribute
        // if on a destination page.
        if (PimConfig.MAP_TYPE === 'DESTINATION') {
            // If on a monthly page, set the rateType to monthly.
            if (typeof(MONTHLY_LAYER) !== 'undefined' && MONTHLY_LAYER) {
                rateType = 'L';
            }

            rateCost = this.lowest_rate;
        }

        if (PimConfig.MAP_TYPE === 'LOTPAGE') {
            // Assign calculated rates to LOT or LOTS object.
            this.calculatedRates = [{
                rateCost: rateCost,
                quotedDuration: 'dummy text',
                rateType: rateType
            }];
        }

        // get cached value of lot
        this.id = String(this.id);
        cachedLot = thisManager.cache[this.id];

        // if not in cache, make a new lot
        if (cachedLot === undefined ||
            PimConfig.MAP_TYPE === 'DESTINATION' ||
            PimConfig.MAP_TYPE === 'LOTPAGE') {
                lot = new Lot();
                lot.initialize(thisManager.map, this, thisManager.getMarkerSize());
                thisManager.cache[this.id] = lot;
        // if already in cache, update attributes
        } else {
            // Don't clean the attributes if on destination page,
            // otherwise the distance will reset to 0.00.
            cachedLot.attributes = cachedLot.cleanAttributes(this);
        }

        // once we have a lot in the view, we remove the paramter
        // this prevents an un-needed secondary call to zoomToLot
        if (PimConfig.configParams.lot === this.id) {
            PimConfig.configParams.lot = null;
            thisManager.centerAndFocus(this.id);
        }

        lotAttribues = cachedLot ? cachedLot.attributes : lot.attributes;

        // insert into recentLots (list used for parkme algo)
        if (PimConfig.MAP_TYPE !== 'LOTPAGE') {
            if (OffSM.mapBoundsContains(thisManager.map.getBounds(),
                lotAttribues.lat, lotAttribues.lng)) {
                thisManager.recentLots.push(this.id);
            }
        }
    });

    this.drawOnMap();

    // if lot not on map, zoom to lot
    if (PimConfig.configParams.lot || PimConfig.configParams.lot_alias) {
        this.zoomToLot(
            PimConfig.configParams.lot,
            PimConfig.configParams.lot_alias
        );
    }
};

OffStreetManager.prototype.centerAndFocus = function(lotID) {
    var lot = this.cache[lotID];
    this.center(lot);
    lot.focus();
};

OffStreetManager.prototype.zoomToLot = function (lot_id, lot_alias) {
    var data,
        thisManager = this;

    // build the core query for id or alias
    if (lot_id) {
        PimConfig.configParams.lot = lot_id;
        data = {
            'id': lot_id,
            'chk': PimConfig.getCHK(lot_id)
        };

    } else if (lot_alias) {
        PimConfig.configParams.lot_alias = null;
        data = {
            'alias': lot_alias,
            'chk': PimConfig.getCHK(lot_alias)
        };
    }

    // extend with rate/query paramters
    data = $.extend({}, PimConfig.globalParams(), data, {
        max: 1,
        det: 1,
        entry: PimUtil.ISODateFormat(MapPage.timeSlider.startTime),
        rate_request: ''
    });

    // If monthly, we pass duration of 0
    //  otherwise, pass current duration.
    if (PimConfig.configParams.filter === 'monthly') {
        data.duration = 0;
        data.rate_request = 'L';
    } else {
        data.duration = MapPage.timeSlider.duration;
        data.rate_request = 'B';
    }

    $.jsonp({
        type: 'GET',
        data: data,
        callbackParameter: 'callback',
        url: PimUtil.getVirtualHost('api') + '/lots',
        success: function (response) {

            if (response.result.length === 1) {
                log.info('GetFeature id returned with 1 lot');

                // draw the lot
                thisManager.handleData(response);
                thisManager.centerAndFocus(response.result[0].id);

            } else {
                log.info('GetFeature id returned with ' +
                        response.FacilityCount + ' lots');
            }

        },
        error: function () {
            log.info('GetFeature id Request Timeout :-(');
        }
    });
};

OffStreetManager.prototype.zoomChange = function () {
    google.maps.event.addListener(MapPage.map, 'zoom_changed', function () {
        OffSM.refresh();
    });
};

var OffSM = new OffStreetManager();

// Hook ourselves into the Init
OffStreetManager.OffStreetInitView = MapPage.initView;
MapPage.initView = function () {

    OffStreetManager.OffStreetInitView();
    OffSM.initialize(MapPage.map);

    MapPage.customEvents.addEventlistener('true_idle', function () {
        var halfBounds = MapPage.getPercentBounds(0.75),
            lastCenter = OffSM.lastActualBounds,
            initialZoom = PimConfig.DEFAULTZOOM;

        // Manages list and pin refresh based on map center point
        // and zoom level. if beyond certain bounds or zoom-out level,
        // a refresh is triggered.
        // Example: manually moving the map or zooming out.
        if (PimConfig.configParams.filter !== 'street' &&
            OffSM.zoom < (initialZoom - 1) ||
            !OffSM.lastActualBounds ||
            !OffSM.mapBoundsContains(halfBounds,
                lastCenter.getCenter().lat, lastCenter.getCenter().lng)) {
            OffSM.refresh();
        }

        /* Keep this code.  It is very useful for diagnostic purposes
        if (lastCenter) {
            console.log('Box size %: ' +
                (halfBounds.$.b - halfBounds.$.d) / (MapPage.map.getBounds().$.b - MapPage.map.getBounds().$.d));
            console.log('Distance to side %: ' +
                ((halfBounds.$.b  -lastCenter.getCenter().jb) / (halfBounds.$.b - halfBounds.$.d)));
            console.log('Contained?:' + halfBounds.contains(lastCenter.getCenter()));
            OffSM.showOverQuery(halfBounds);
        } */

    });

    MapPage.customEvents.addEventlistener('duration_change', function () {
        // OffSM.resetManager();
        OffSM.APIRequest(OffSM.lastQueryBounds);

        // Referencing JIRA ticket MID-317
        // In the past, the info bubble would stay open when
        // switching between filter layers (clicking Daily, Reserve or Monthly buttons)
        // Adding the following function closes the info window
        // when switching filter layers. Only applies to off-street.
    });

    OffSM.zoomChange();
};
;
/* global Facility, google, Marker, PimUtil */

/* jshint browser:true, camelcase:false, devel:true, jquery:true */

'use strict';

var Meter = function () {};

Meter.prototype = new Facility();

// Mapping of statistics about markers used for meters.
//
// s: Image Size,
// o: Offset for the point at the bottom of the bubble
// c: Offset for the center of the bubble
// f: Font size for embedded label
try {
    Meter.prototype.MARKER_DIMENSIONS = {
        48: {
            's': new google.maps.Size(52, 44),   // Marker Size
            'o': null,                           // Marker Icon Offset
            'c': new google.maps.Point(17, 33),  // Rate Label Offset
            'l': new google.maps.Point(-9, -1),  // Occupancy Label Offset
            'f': '20px'
        }
    };
} catch (e) {
    console.log('Bypassing meter marker dimensions');
}

Meter.prototype.initialize = function (map, attributes, markerSize) {
    var thisMeter = this,
        strokeWeight = map.zoom < 16 ? 2.5 : 4.5;

    // Initialize core meter data.
    this.map = map;
    this.markerSize = markerSize;

    // Clean attributes
    this.attributes = this.cleanAttributes(attributes);

    // Construct marker for the meter.
    this.marker = new Marker();
    this.marker.initialize(
        // Pass in null to satisfy t_apis argument
        null,
        this.map,
        //change to polyline 6 if found in attributes and add precision
        this.attributes.polyline6 ?  [this.attributes.polyline6] : this.attributes.pline_arr,
        Meter.prototype.getCoords(this.attributes),
        Meter.prototype.getPolygonAndLatLng(this.attributes).newPolygon,
        {
            drawPolys: true,
            markerSize: markerSize,
            strokeWeight: strokeWeight,
            isOpen: this.attributes.isOpen,
            occupancy: this.attributes.probability,
            rates: this.attributes.structuredRates,
            peps: [],
            imageURL: '/webmap/img/street_pins/',
            dimensions: this.MARKER_DIMENSIONS,
            currency: this.attributes.currency,
            facilityType: 'meter',
            clickHandler: function () {
                PimUtil.recordAction('meterClick', thisMeter.segmentID);
                thisMeter.focus();
            },
            mouseoverHandler: function () {
                thisMeter.hover();
            },
            mouseoutHandler: function () {
                thisMeter.hoverClear();
            }
        },
        // add precision argument based on polyline6 encoding being present
        this.attributes.polyline6 ? 6 : 5,
        this.attributes
    );
};

// Handle setting of intelligent defaults (typically null) for
// missing data and perform some very basic data clean up.
Meter.prototype.cleanAttributes = function (attributes) {
    var polypoint,
        polyArray = [];

    // Equivalent of a super call
    attributes = Facility.prototype.cleanAttributes.call(this, attributes);

    // Is there a detail page for this class?
    attributes.detailPage = true;

    // Convert Polyline6 into a Path
    if (attributes.polyline6) {
         // Estimate the lat and lng for a meter based on its polyline.
        polyArray.push(attributes.polyline6);
        attributes.pline_arr = polyArray;

        try {
            polypoint = PimUtil.decodePolyline(polyArray[0], 6)[0];
            attributes.lat = polypoint[0];
            attributes.lng = polypoint[1];
        } catch (err) {
            attributes.lat = null;
            attributes.lng = null;
        }

    } else {
        // Estimate the lat and lng for a meter based on its polyline.
        polyArray.push(attributes.polyline);
        attributes.pline_arr = polyArray;
        try {
            polypoint = google.maps.geometry.encoding.decodePath(polyArray[0])[0];
            attributes.lat = polypoint.lat();
            attributes.lng = polypoint.lng();
        } catch (err) {
            attributes.lat = null;
            attributes.lng = null;
        }
    }

    // camel case formatting
    if ('is_open' in attributes && !('isOpen' in attributes)) {
        attributes.isOpen = attributes.is_open;
    }
    if ('pmt_types' in attributes && !('pmtTypes' in attributes)) {
        attributes.pmtTypes = attributes.pmt_types;
    }

    // Use "rateCards" instead of rateCard
    attributes.rateCard = attributes.rateCards;

    // Commented this out in attempt to fix -- TypeError: Unable to delete property.
    // delete attributes.calculated_rates;
    attributes.calculatedRates = null;

    return attributes;
};

Meter.prototype.getPolygonAndLatLng = function (attr) {
    return {
        newLatLng: new google.maps.LatLng(attr.lat, attr.lng),
        newPolygon: google.maps.Polyline
    };
};

// Meter weight should be thicken at closer zoom levels
Meter.prototype.getStroke = function (markerSize) {
    if (markerSize === 96) {
        return 6;
    } else {
        return 4;
    }
};

Meter.prototype.getCoords = function (attr) {
    return new google.maps.LatLng(attr.lat, attr.lng);
}
;
/*global FacilityManager, google, MapPage, Meter,
    PimConfig, ListManager, $, PimUtil, Filter, mapboxgl */

/* jshint browser:true, camelcase:false, devel:true, jquery:true */

'use strict';

/*
   Handles events such as zoom and map move, as well as
   API calls and caching.

   Requires: FacilityManager and Meter
*/

var OnStreetManager = function () {},
    OnSM;

OnStreetManager.prototype = new FacilityManager();

OnStreetManager.prototype.regions = [];
OnStreetManager.prototype.URL = '/blocks';
OnStreetManager.prototype.limit = 2500;

// Go to segment in the webmap if in url.
OnStreetManager.prototype.centerAndFocus = function(segmentID) {
    var segment = this.cache[segmentID];
    this.center(segment);
    segment.focus();
};

OnStreetManager.prototype.boundsTrigger = function () {
    var bounds,
        zoom,
        minZoom;
     minZoom = 14;
    bounds = this.map.getBounds();
    zoom = this.map.getZoom();
};

OnStreetManager.prototype.handleData = function (response) {
    var thisManager = this,
        meterPolys = function (poly, color, precision) {
            // Decode using optional extra precision
            var decodedPoints = PimUtil.decodePolyline(poly, precision || 5).map(function(point) {
                    return {
                        lat: point[0],
                        lng: point[1]
                    };
                });
            MapPage.map.set({
                'polyline': new google.maps.Polyline({
                    'path': decodedPoints,
                    'map': MapPage.map,
                    'strokeColor': color,
                    'strokeOpacity': 0.7
                })
            });
        };

    // Clear the onstreet layer
    MapPage.clearOnstreet && MapPage.clearOnstreet();

    // To store blocks for listManager
    OnStreetManager.prototype.blockCache = {};

    // Don't render meters if zoomed out.
    if (MapPage.map.zoom < 15) {
        return;
    }

    // update the timezone for the map
    if (MapPage.timeSlider) {
        MapPage.timeSlider.updateTimeZone(response);
    }

    // Add to cache or update each Meter described in response.
    // Updated probability to use the bucket value.
    $.each(response.result, function () {
        var thisMeter = this,
            block;

        // Show the meter line in the meter page map
        if (PimConfig.MAP_TYPE === 'LOTPAGE') {
            meterPolys(this.polyline, '#0066FF');
        } else {
            block = new Meter();

            // Initialize to build the master block object
            block.initialize(thisManager.map, thisMeter, thisManager.getMarkerSize());

            // Add colorName to marker
            if (block.attributes.segments && block.attributes.segments[0]) {
                block.marker.colorName = Probability.getColorName(
                    block.attributes.segments[0].isOpen,
                    block.attributes.invalidCost,
                    block.attributes.bucket
                );

                block.attributes.rateCard = block.attributes.segments[0].rateCards;
            }

            OnStreetManager.hidePolys(block);

            // Add blocks to blockCache
            OnStreetManager.prototype.blockCache[this.blockID] = block;

            // Object array for segment markers
            OnStreetManager.prototype.blockCache[thisMeter.blockID].segmentMarkers = [];
        }

        // Iterate thru each segment.
        $.each(thisMeter.segments, function () {
            var cachedSegment,
                meter,
                fullID = this.segmentID + '-' + thisMeter.blockID;

            // Pass global attributes to segments.
            this.name = thisMeter.name;
            this.address = thisMeter.address || '';
            this.probability = thisMeter.bucket || null;
            this.bucket = thisMeter.bucket || null;
            this.asset_thumbs = thisMeter.photoThumbs;
            this.m_id = thisMeter.blockID;
            this.currency = thisMeter.currency;
            this.distance = thisMeter.distance;
            this.amenities = thisMeter.amenities;

            // Show the segment lines in the meter page map.
            if (PimConfig.MAP_TYPE === 'LOTPAGE') {
                if (this.polyline6){
                    meterPolys(this.polyline6, '#FF0000', 6);
                } else {
                    meterPolys(this.polyline, '#FF0000');
                }
                return;
            }

            // get cached value of meter
            cachedSegment = thisManager.cache[fullID];

            // if not in cache, make a new meter
            if (cachedSegment === undefined) {
                meter = new Meter();
                meter.initialize(thisManager.map, this, thisManager.getMarkerSize());
                thisManager.cache[fullID] = meter;
                cachedSegment = meter;

                if (PimConfig.configParams.meter === fullID) {
                    PimConfig.configParams.meter = null;
                    thisManager.center(meter);
                    meter.focus();
                }

            // else, update attributes
            } else {
                cachedSegment.attributes = cachedSegment.cleanAttributes(this);

                // Show the meter lines
                cachedSegment.marker.polygonsShow(cachedSegment.map);
            }

            // Once we have a meter in the view, we remove the paramter.
            // This prevents an un-needed secondary call.
            if (PimConfig.configParams.meter === this.m_id) {
                PimConfig.configParams.meter = null;
                thisManager.centerAndFocus(fullID);
            }

            // Push segment markers to block for infowindow positions
            OnStreetManager.prototype.blockCache[thisMeter.blockID]
                .segmentMarkers.push(cachedSegment.marker);
        });
    });

    //draw on map
    this.drawOnMap();

    // Run Mapbox-specific onstreet functions for Opboard
    OnStreetManager.mapboxOnstreet();

    // If there are no meters in the response,
    // render a "no meters" message
    if (response.result.length === 0) {
        ListManager.noFeatureLotsMessage();
    }

    // if meter not on map, zoom to meter
    if (PimConfig.configParams.meter) {
        this.zoomToMeter(
            PimConfig.configParams.meter
        );
    }
};

OnStreetManager.prototype.zoomToMeter = function (meter_id) {
    var data,
        thisManager = this;

    PimConfig.configParams.meter = meter_id;

    var factor = (17 - this.zoom) / 2;
    // Change the bounds based on zoom level.
    if (this.zoom > 16) {
        // Default bounds.
        PimConfig.DEFAULT_PADDED_VIEW_BOUNDS = 2.5;
    } else {
        // Bounds are smaller when zoomed out.
        PimConfig.DEFAULT_PADDED_VIEW_BOUNDS = 2.5 - factor;
    }

    data = $.extend({}, PimConfig.globalParams(), {
        id: meter_id,
        chk: PimConfig.getCHK(meter_id),
        entry: PimUtil.ISODateFormat(MapPage.timeSlider.startTime),
        duration: MapPage.timeSlider.duration,
        rate_request: 'B'
    });

    $.jsonp({
        type: 'GET',
        data: data,
        callbackParameter: 'callback',
        url: PimUtil.getVirtualHost('api') + this.URL,
        success: function (response) {

            if (response.result.length === 1) {
                log.info('GetFeature id returned with 1 meter');

                thisManager.handleData(response);
                var thisMeter = response.result[0];
                if (thisMeter.segments.length > 0) {
                    thisManager.centerAndFocus(
                        thisMeter.segments[0].segmentID + '-' + thisMeter.blockID);
                }

            } else {
                log.info('GetFeature id returned with ' +
                        response.FacilityCount + ' meters');
            }

        },
        error: function () {
            log.info('GetFeature id Request Timeout :-(');
        }
    });
};

OnStreetManager.mapboxOnstreet = function () {
    // Placeholder
};

OnStreetManager.hidePolys = function (block) {
    // Hide the block polyline
    block.marker.polygonsHide();
};

// Datastore for the market polygons.
OnStreetManager.prototype.marketPolyCache = {};

OnStreetManager.getMarketPolys = function () {
    // Get the list of markets.
    $.ajax({
        dataType: 'json',
        url: PimUtil.getVirtualHost('api') + '/destination/?categories=onstreet&pub_id=169&max=10000000',
        success: function (data) {
            OnStreetManager.processMarketPoly(data);
        },
        error: function () {
            console.log('No market data.');
        }
    });
};

OnStreetManager.processMarketPoly = function (data) {
    // Render the market polys but
    // keep them hidden from the map.
    var polyArr = [],
        tmpPolys = [],
        thisPolyCache = OnStreetManager.prototype.marketPolyCache;

    thisPolyCache.marketPoly = {
        polys: {}
    };

    // Loop thru the set of address in the
    // geolocation city object. If found,
    // set the market to that city.
    data.Destinations.forEach(function (market, i) {


        // Set the poly cache object as the polygon.
        thisPolyCache.marketPoly.polys['poly' + i] = new google.maps.Polygon({
            paths:  google.maps.geometry.encoding.decodePath(market.onstreet_coverage),
            strokeColor: '#FF0000',
            strokeOpacity: 1,
            strokeWeight: 1,
            fillColor: '#FFB6C1',
            fillOpacity: 0.6,
            map: null
        });

        // Reset poly arrays.
        tmpPolys = [];
        polyArr = [];
    });
};

// Flag set to add and clear
// market polys when zooming.
OnStreetManager.showingPolys = true;

OnStreetManager.zoomChangeEvent = function () {
    google.maps.event.addListener(MapPage.map, 'zoom_changed', function () {

        // Change the strokeWeight based on zoom.
        // Zoom out = thinner lines.
        // Show/hide market polys on zoom.
        if (PimConfig.configParams.filter === 'street') {
            MapPage.fireBlocksFilter();
            MapPage.changeStrokeWeight();
            OnStreetManager.showMarketPolygon(this.zoom);
        }
    });
};

OnSM = new OnStreetManager();

OnStreetManager.showMarketPolygon = function (zoom) {
    var thisPolyCache = OnStreetManager.prototype.marketPolyCache;

    if (thisPolyCache.marketPoly) {
        if (zoom < 15) {
            if (!OnStreetManager.showingPolys) {
                // Loop thru each poly and clear it from the map.
                for (var poly in thisPolyCache.marketPoly.polys) {
                    if (thisPolyCache.marketPoly.polys.hasOwnProperty(poly)) {
                        thisPolyCache.marketPoly.polys[poly].setMap(MapPage.map);
                    }
                }

                // Hide polylines.
                for (poly in OnSM.cache) {
                    if (OnSM.cache.hasOwnProperty(poly)) {
                        OnSM.cache[poly].marker.hideMarker();
                    }
                }

                // Set flag to true to stop duplicate polys.
                OnStreetManager.showingPolys = true;
            }
        } else if (OnStreetManager.showingPolys) {
            // Loop thru each poly and clear it from the map.
            for (var poly in thisPolyCache.marketPoly.polys) {
                if (thisPolyCache.marketPoly.polys.hasOwnProperty(poly)) {
                    thisPolyCache.marketPoly.polys[poly].setMap(null);
                }
            }

            // Show cached polylines but not markers.
            for (poly in OnSM.cache) {
                if (OnSM.cache.hasOwnProperty(poly)) {
                    OnSM.cache[poly].marker.showMarker(true);
                }
            }

            // Trigger map refresh.
            MapPage.customEvents.dispatch('true_idle');

            // Reset flag.
            OnStreetManager.showingPolys = false;
        }
    }
};

MapPage.fireBlocksFilter = function (durationChange) {
    var halfBounds = MapPage.getPercentBounds(0.5),
        lastCenter = OnSM.lastActualBounds,
        filterActive = $('.list_filter_blocks:visible select').val();
     // Trigger a refresh if zoom is one level
    // before/after market poly is shown.
    if (MapPage.map.zoom === 15) {
        OnSM.boundsTrigger();
    } else if (durationChange || filterActive ||
        !OnSM.lastActualBounds ||
        !OnSM.mapBoundsContains(MapPage.map.getBounds(),
        lastCenter.getCenter().lat, lastCenter.getCenter().lng)) {
         OnSM.boundsTrigger();
    }
     Filter.blocksFilter();
};

// Hook ourselves into the Init
OnSM.MapPageInitView = MapPage.initView;
MapPage.initView = function () {
    // Call the original one
    OnSM.MapPageInitView();
    OnSM.initialize(MapPage.map);

    // Collect the market polys via ajax
    // and show them when zoomed out.
    OnStreetManager.getMarketPolys();

    // Map Move/Drag Event
    MapPage.customEvents.addEventlistener('true_idle', function () {
        if (PimConfig.configParams.filter === 'street') {
            Filter.blocksFilter();
        }
    });

    // Duration/Rate Change Event
    MapPage.customEvents.addEventlistener('duration_change', function () {
        if (PimConfig.configParams.filter === 'street') {
            // Automatically trigger a refresh on duration change.
            MapPage.fireBlocksFilter(true);
            // OnSM.APIRequest(OnSM.lastQueryBounds);
        } else {
            OnSM.APIRequest(OnSM.lastQueryBounds);
        }
    });

    // Zoom Change Event
    return OnStreetManager.zoomChangeEvent();
};
;
/* global google, MapPage, navigator */

/* jshint browser:true, camelcase:false, devel:true, jquery:true */

'use strict';

var Geolocator = function () {

    this.curlat = null;
    this.curlon = null;

    this.locMarker = null;

    this.getLocation = function () {
        var thisGeo = this;

        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(function (position) {
                thisGeo.curlat = position.coords.latitude;
                thisGeo.curlon = position.coords.longitude;

                thisGeo.locMarker.setPosition(new google.maps.LatLng(thisGeo.curlat, thisGeo.curlon));
                thisGeo.locMarker.setMap(MapPage.map);

                MapPage.map.setCenter(new google.maps.LatLng(thisGeo.curlat, thisGeo.curlon));

                // clear the hash on search
                // this enables us to "re-search" after geolocation
                // see MID-86 for more details
                window.location.hash = '';
            });
        } else {
            alert(
                'Geolocation is currently not supported by this browser. ' +
                'You are either using a non-compliant browser (such as Internet Explorer) ' +
                'or because you haven\'t clicked `Allow` on the share geolocation prompt');
        }
    };
};

Geolocator.prototype.initialize = function () {
    // Define a map marker
    this.locMarker = new google.maps.Marker({
        clickable: false,
        icon: {
            'url': '/webmap/img/icons/mp_location_icon.png'
        },
        map: null,
        position: new google.maps.LatLng(0, 0),
        title: 'You are Here'
    });
};

//Hook ourselves into the Init
if (typeof MapPage !== 'undefined') {
    Geolocator.MapPageInitView = MapPage.initView;
    MapPage.initView = function () {

        MapPage.geolocator = new Geolocator();
        MapPage.geolocator.initialize();

        // Call the original one
        return Geolocator.MapPageInitView();
    };
}
;
/* global MapPage, PimConfig, OnSM, gettext */

/* jshint browser:true, camelcase:false, devel:true, jquery:true */

'use strict';

var Filter = {
    isStreet: PimConfig.configParams.filter === 'street',

    initializeCustomDropDowns: function() {
        // Detect if a College Station destination page.
        var collegeStation = window.location.href
                                .indexOf('college-station-tx-parking') !== -1;

        // Set default sort option
        if (PimConfig.configParams.filter === 'street' || collegeStation) {
            PimConfig.configParams.sort = 'distance';
        }

        // Select the default sort option.
        $('.list_sort option[value=' + PimConfig.configParams.sort + ']')
            .prop('selected', 'selected');

        // Init the custom selector
        // Required so we can do styling on the selector
        $('.list_sort').customSelect();

        // Bind the Chosen lib and options
        this.bindAmenitiesFilter();

        // After custom select creates DOM elements add custom styling
        if (PimConfig.MAP_TYPE === 'DESKTOP') {
            $('.customSelectInner').css('width', '185px');
        } else {
            $('.customSelectInner').css('width', '160px');
        }
        $('.styled').css('cursor', 'pointer');

        // Redraw the list on filter change
        $('.list_filter_lots select, .list_sort').change(function () {
            MapPage.ppMap.closeAllInfoWindows();
            MapPage.customEvents.dispatch('redraw_list');
        });

        $('.list_filter_blocks select').change(function () {
            MapPage.ppMap.closeAllInfoWindows();
            Filter.blocksFilter();
        });
    },

    blocksFilter: function() {
        var valArray = $('.list_filter_blocks:visible select').val(),
            restrictions = '';

        // If restrictions are selected, concatenated
        // the restriction values and pass to refresh.
        if (valArray) {
            valArray.forEach(function (val) {
                if (restrictions) {
                    restrictions += ',' + val;
                } else {
                    restrictions += val;
                }
            });
        }

        // Reset and refresh.
        OnSM.resetManager();
        OnSM.refresh(restrictions);
    },

    bindAmenitiesFilter: function() {
        var filterTarget = MapPage.filterTarget(),
            isStreet = PimConfig.configParams.filter === 'street',
            lotsOrBlocks = isStreet ? ' .list_filter_blocks select' :
                            ' .list_filter_lots select';

        // Amenities filter, limited to 3 amenties.
        $(filterTarget + lotsOrBlocks).chosen({
            placeholder_text_multiple: isStreet ?
                gettext('Filter: Restrictions') : gettext('Filter: Amenities'),
            max_selected_options: 3,
            display_disabled_options: false
        }).on('chosen:updated', function () {
            // Adds and removes class that shows/hides down arrow
            var $input = $('.chosen-container-multi .chosen-choices li.search-field input[type="text"]');

            if ($('.search-choice').length > 0) {
                $input.addClass('no-bg');
            } else {
                $input.removeClass('no-bg');
            }
        });
    }
};

// Hook ourselves into the Init
var filterInitView = MapPage.initView;

MapPage.initView = function () {
    Filter.initializeCustomDropDowns();
    return filterInitView();
};

var durationPopup = {
    // show duration modal
    showDateModal: function () {
        $('#duration_drop_down, #modal_background').show();
    },

    // binds modal to time btn and buttons to hide modal
    bindModal: function () {
        // main modal btn
        $('#filterTimeSelect').click(function () {
            durationPopup.showDateModal();
        });

        // modal background and modal search btn
        $('#modal_background, #time-change-submit').click(function () {
            $('#duration_drop_down, #modal_background').hide();
        });
    }
};

// Since DESKTOP is the only place where there are
// two sets of filters (desktop and mobile),
// only select :visible if on desktop/regular webmap.
MapPage.filterTarget = function () {
    if (PimConfig.MAP_TYPE === 'DESKTOP') {
        return '.filter-box:visible';
    } else {
        return '.filter-box';
    }
};

$(window).resize(function () {
    // Bind the Chosen filter lib
    Filter.bindAmenitiesFilter();

    // Hide the filter dropdown
    $('#filter_drop_down').hide();
});

$(function () {
    durationPopup.bindModal();
});
;
/* ========================================================================
 * Bootstrap: dropdown.js v3.1.1
 * http://getbootstrap.com/javascript/#dropdowns
 * ========================================================================
 * Copyright 2011-2014 Twitter, Inc.
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * ======================================================================== */


+function ($) {
  'use strict';

  // DROPDOWN CLASS DEFINITION
  // =========================

  var backdrop = '.dropdown-backdrop'
  var toggle   = '[data-toggle=dropdown]'
  var Dropdown = function (element) {
    $(element).on('click.bs.dropdown', this.toggle)
  }

  Dropdown.prototype.toggle = function (e) {
    var $this = $(this)

    if ($this.is('.disabled, :disabled')) return

    var $parent  = getParent($this)
    var isActive = $parent.hasClass('open')

    clearMenus()

    if (!isActive) {
      if ('ontouchstart' in document.documentElement && !$parent.closest('.navbar-nav').length) {
        // if mobile we use a backdrop because click events don't delegate
        $('<div class="dropdown-backdrop"/>').insertAfter($(this)).on('click', clearMenus)
      }

      var relatedTarget = { relatedTarget: this }
      $parent.trigger(e = $.Event('show.bs.dropdown', relatedTarget))

      if (e.isDefaultPrevented()) return

      $parent
        .toggleClass('open')
        .trigger('shown.bs.dropdown', relatedTarget)

      $this.focus()
    }

    return false
  }

  Dropdown.prototype.keydown = function (e) {
    if (!/(38|40|27)/.test(e.keyCode)) return

    var $this = $(this)

    e.preventDefault()
    e.stopPropagation()

    if ($this.is('.disabled, :disabled')) return

    var $parent  = getParent($this)
    var isActive = $parent.hasClass('open')

    if (!isActive || (isActive && e.keyCode == 27)) {
      if (e.which == 27) $parent.find(toggle).focus()
      return $this.click()
    }

    var desc = ' li:not(.divider):visible a'
    var $items = $parent.find('[role=menu]' + desc + ', [role=listbox]' + desc)

    if (!$items.length) return

    var index = $items.index($items.filter(':focus'))

    if (e.keyCode == 38 && index > 0)                 index--                        // up
    if (e.keyCode == 40 && index < $items.length - 1) index++                        // down
    if (!~index)                                      index = 0

    $items.eq(index).focus()
  }

  function clearMenus(e) {
    $(backdrop).remove()
    $(toggle).each(function () {
      var $parent = getParent($(this))
      var relatedTarget = { relatedTarget: this }
      if (!$parent.hasClass('open')) return
      $parent.trigger(e = $.Event('hide.bs.dropdown', relatedTarget))
      if (e.isDefaultPrevented()) return
      $parent.removeClass('open').trigger('hidden.bs.dropdown', relatedTarget)
    })
  }

  function getParent($this) {
    var selector = $this.attr('data-target')

    if (!selector) {
      selector = $this.attr('href')
      selector = selector && /#[A-Za-z]/.test(selector) && selector.replace(/.*(?=#[^\s]*$)/, '') //strip for ie7
    }

    var $parent = selector && $(selector)

    return $parent && $parent.length ? $parent : $this.parent()
  }


  // DROPDOWN PLUGIN DEFINITION
  // ==========================

  var old = $.fn.dropdown

  $.fn.dropdown = function (option) {
    return this.each(function () {
      var $this = $(this)
      var data  = $this.data('bs.dropdown')

      if (!data) $this.data('bs.dropdown', (data = new Dropdown(this)))
      if (typeof option == 'string') data[option].call($this)
    })
  }

  $.fn.dropdown.Constructor = Dropdown


  // DROPDOWN NO CONFLICT
  // ====================

  $.fn.dropdown.noConflict = function () {
    $.fn.dropdown = old
    return this
  }


  // APPLY TO STANDARD DROPDOWN ELEMENTS
  // ===================================

  $(document)
    .on('click.bs.dropdown.data-api', clearMenus)
    .on('click.bs.dropdown.data-api', '.dropdown form', function (e) { e.stopPropagation() })
    .on('click.bs.dropdown.data-api', toggle, Dropdown.prototype.toggle)
    .on('keydown.bs.dropdown.data-api', toggle + ', [role=menu], [role=listbox]', Dropdown.prototype.keydown)

}(jQuery);
;
/*jshint jquery:true, devel: true, browser: true, multistr:true */
/* global google, $ */

'use strict';

// Mobile device detection
var isMobile = {
    Android: function() {
        return navigator.userAgent.match(/Android/i) ? true : false;
    },
    BlackBerry: function() {
        return navigator.userAgent.match(/BlackBerry/i) ? true : false;
    },
    iOS: function() {
        return navigator.userAgent.match(/iPhone|iPad|iPod/i) ? true : false;
    },
    Windows: function() {
        return navigator.userAgent.match(/IEMobile/i) ? true : false;
    },
    any: function() {
        return (isMobile.Android() || isMobile.BlackBerry() || isMobile.iOS() || isMobile.Windows());
    }
};

// Detects page referrer and returns the
// type of page that was previously viewed.
function referrerForMixpanel() {
    var referrer = document.referrer;

    if (referrer.search(/.*-parking$/) === 0) {
        return 'city';
    } else if (referrer.search(/.*-parking\//) === 0 &&
        referrer.indexOf('event') === -1) {
        return 'venue';
    } else if (referrer.indexOf('event') !== -1) {
        return 'event';
    } else if (referrer.indexOf('map') !== -1) {
        return 'map';
    } else if (referrer.indexOf('lot') !== -1) {
        return 'lot';
    } else {
        return 'direct';
    }
}

function mixpanelAppClient() {
    var width = $(window).width();

    if (window.self !== window.top) {
        return 'widget';
    } else if (width > 1055) {
        return 'web 1056';
    } else if (width < 1056 && width > 959) {
        return 'web 960';
    } else if (width < 960 && width > 767) {
        return 'web 768';
    } else if (width < 768) {
        return 'web mobile';
    } else {
        return undefined;
    }
}

/* Mobile styling for the datepickers
   Makes them 100% width for easier access */
function mobileStyling() {

    var $window = $(window),
        $datepickers = $('.dt_date_start, .dt_date_end'),
        $style,
        styling,
        applyStyling;

    // css styling
    styling = '\
        .datepicker.dropdown-menu {                 \
            width: 100%;                            \
            height: 100%;                           \
            top: 0 !important;                      \
            left: 0 !important;                     \
            margin: 0 !important;                   \
            padding: 0 !important;                  \
        }                                           \
                                                    \
        .ui-timepicker-wrapper {                    \
            top: 0 !important;                      \
            left: 0 !important;                     \
            width: 100% !important;                 \
            height: 100% !important;                \
        }                                           \
                                                    \
        .ui-timepicker-list li {                    \
            text-align: center;                     \
            border-bottom: 1px solid lightgray;     \
            padding: 20px !important;               \
        }                                           \
                                                    \
        .datepicker-days:after {                    \
            content: "Select Date to Continue";     \
            border-bottom-color: rgba(0, 0, 0, 0.2);\
            margin: 20px 0;                         \
            text-align: center;                     \
            display: block;                         \
        }                                           \
    ';
    $style = $('<style type="text/css">' + styling + '</style>');

    // execute and define the apply styling function
    // first removes all styling and then re-applys it
    applyStyling = (function () {
        $style.remove();
        $datepickers.prop('readonly', false);
        if ($window.width() <= 768) {
            $datepickers.prop('readonly', true);
            $style.appendTo('head');

            $('.select_a_date input').on('focus', function () {
                $(window).scrollTop(0);
            });
        } else {
            $('.select_a_date input').off('focus');
        }
    })();

    // apply stylinng on any window resize
    $window.resize(applyStyling);
}

function miscHeaderInit () {
    var autocomplete,
        searchElement = document.getElementById('searchLoc'),
        $searchForm = $('#search-form');

    // Autocomplete for header search
    try {
        if (searchElement) {
            autocomplete = new google.maps.places.Autocomplete(searchElement);
            autocomplete.setFields(['name']);
            google.maps.event.addListener(autocomplete, 'place_changed', function () {
                // added a short delay
                // note, I know this is sloppy but the callback doesn't seem
                // to be exactly when the value is changed.
                $searchForm.delay(1000).submit();
            });
        }
    } catch (err) {}

    // Custom classes for homepage, citypage and webmap
    // Makes header 93% width
    if ($('.page-home').length || $('.filter-panel').length || $('.full-header').length || $('.city-hero').length) {
        $('.header-row').addClass('header-98');
    }

    // Makes header (nav) transparent and fixed,
    // and then turns white when scrolling down
    if ($('.page-home').length || $('.module-city-background').length || $('.trans-header').length) {
        $(window).scroll(function () {
            addRemClasses();
        });
    }

    showSearch();
    clearSearch();
    basicLoginForm();
}

function footerBottom () {
    var bodyHeight = $('body').height();
    var windowHeight = $(window).height();
    var delta = windowHeight - bodyHeight;

    if (bodyHeight < windowHeight) {
        $('#footer').css('margin-top', delta);
    }
}

// Clears the header search field and refocuses.
// Also shows/hides the clear btn if text is entered.
function clearSearch () {
    var search = $('#searchLoc'),
        clear = $('#clear-search'),
        ua = window.navigator.userAgent,
        msie = ua.indexOf('MSIE '),
        isIE = msie > 0 || !!navigator.userAgent.match(/Trident.*rv\:11\./);

    // Hide or show clear btn when typing.
    search.on('keyup', function () {
        if (search.val() !== '') {
            // IE has its own X.
            if (!isIE) {
                clear.show();
            }
        } else {
            clear.hide();
        }
    });

    // Clear/focus search input and
    // hide the clear btn.
    clear.click(function () {
        search.val('').focus();
        $(this).hide();
    });
}

function showSearch() {
    var overlayHtml = '<div id="search-overlay" class="hide"></div>',
        body = $('body');

    body.append(overlayHtml);

    // Show the search bar when clicking the search icon.
    $('#outter-search-icon').click(function() {
        $('#header_fullsize').addClass('nav-search-mode');
        $('#search-form').show();
        $('#searchLoc').show();
        $('#searchLoc').focus();

        // Hide the logo.
        $('.logo-mobile').addClass('logo-hidden');

        $('#search-overlay').show();
    });

    // Hide the search bar when clicking away.
    $('#nav-back-arrow').click(function() {
        $('#searchLoc').val('');
        $('#search-form, #clear-search').hide();
        $('#searchLoc').hide();

        $('#header_fullsize').removeClass('nav-search-mode');

        // Show the logo.
        $('.logo-mobile').removeClass('logo-hidden');

        $('#search-overlay').hide();
    });
}

// Adding/removing classes based on scroll position
function addRemClasses() {
    if ($(window).scrollTop() > 0) {
        $('#nav-wrapper').removeClass('header-home');
        $('#header_fullsize').addClass('header-fixed');
    } else {
        $('#nav-wrapper').addClass('header-home');
        $('#header_fullsize').removeClass('header-fixed');
    }
}

// Submit form on Return keyup, but only if
// the password field is focused.
function basicLoginForm () {
    $('.basic-login-form').on('keyup', function (e) {
        if (e.keyCode === 13 && $('.basic-password').is(':focus')) {
            $('.basic-login-form').submit();
        }
    });
}

$(function() {
    footerBottom();
    mobileStyling();
    miscHeaderInit();
});
;
/* global PimUtil, MapPage, self, PimConfig */

/* jshint browser:true, camelcase:false, devel:true, jquery:true */

(function () {
  'use strict';
}());

// Security measure to stop fullsize from nesting in iframe
var iframeSecurity = function () {
    if (top !== self) {
        window.location.href = PimUtil.getVirtualHost('www') + '/widget';
    }
};

function reSizeBody() {
    var headerHeight,
        mapWidth;

    iframeSecurity();

    // fullsize header height and map width
    headerHeight = $('#header_fullsize').outerHeight() +
                    $('#mobile-panel:visible').outerHeight();

    // If mobile view, set the map width to window width.
    // Else if on a destination page, set width to 100%.
    // Else, width = window width - panel width.
    // if map width === 0, the ajax url will error out
    // due to a faulty bboxString.
    if (PimConfig.MAP_TYPE === 'DESTINATION') {
        mapWidth = '100%';
    } else {
        mapWidth =  $(window).width() - $('#panel:visible').outerWidth() - 1;
    }

    // Resize Map
    MapPage.googleMapResize(headerHeight, mapWidth);

    // Used to show list after resizing back to large
    // See github #2744
    if (!MapPage.mobileWidth()) {
        $('.filter-panel').show();
    }
}

MapPage.addResizeListeners();

$(function () {
    $('#mobile-list').click(function () {
        if ($(this).text() === 'List') {
            $('.filter-panel').show();
            $(this).text('Map');
        } else {
            $('.filter-panel').hide();
            $(this).text('List');
            reSizeBody();
        }
    });
});
;
(function(t,e){if(typeof exports=="object")module.exports=e();else if(typeof define=="function"&&define.amd)define(e);else t.Spinner=e()})(this,function(){"use strict";var t=["webkit","Moz","ms","O"],e={},i;function o(t,e){var i=document.createElement(t||"div"),o;for(o in e)i[o]=e[o];return i}function n(t){for(var e=1,i=arguments.length;e<i;e++)t.appendChild(arguments[e]);return t}var r=function(){var t=o("style",{type:"text/css"});n(document.getElementsByTagName("head")[0],t);return t.sheet||t.styleSheet}();function s(t,o,n,s){var a=["opacity",o,~~(t*100),n,s].join("-"),f=.01+n/s*100,l=Math.max(1-(1-t)/o*(100-f),t),d=i.substring(0,i.indexOf("Animation")).toLowerCase(),u=d&&"-"+d+"-"||"";if(!e[a]){r.insertRule("@"+u+"keyframes "+a+"{"+"0%{opacity:"+l+"}"+f+"%{opacity:"+t+"}"+(f+.01)+"%{opacity:1}"+(f+o)%100+"%{opacity:"+t+"}"+"100%{opacity:"+l+"}"+"}",r.cssRules.length);e[a]=1}return a}function a(e,i){var o=e.style,n,r;if(o[i]!==undefined)return i;i=i.charAt(0).toUpperCase()+i.slice(1);for(r=0;r<t.length;r++){n=t[r]+i;if(o[n]!==undefined)return n}}function f(t,e){for(var i in e)t.style[a(t,i)||i]=e[i];return t}function l(t){for(var e=1;e<arguments.length;e++){var i=arguments[e];for(var o in i)if(t[o]===undefined)t[o]=i[o]}return t}function d(t){var e={x:t.offsetLeft,y:t.offsetTop};while(t=t.offsetParent)e.x+=t.offsetLeft,e.y+=t.offsetTop;return e}var u={lines:12,length:7,width:5,radius:10,rotate:0,corners:1,color:"#000",direction:1,speed:1,trail:100,opacity:1/4,fps:20,zIndex:2e9,className:"spinner",top:"auto",left:"auto",position:"relative"};function p(t){if(typeof this=="undefined")return new p(t);this.opts=l(t||{},p.defaults,u)}p.defaults={};l(p.prototype,{spin:function(t){this.stop();var e=this,n=e.opts,r=e.el=f(o(0,{className:n.className}),{position:n.position,width:0,zIndex:n.zIndex}),s=n.radius+n.length+n.width,a,l;if(t){t.insertBefore(r,t.firstChild||null);l=d(t);a=d(r);f(r,{left:(n.left=="auto"?l.x-a.x+(t.offsetWidth>>1):parseInt(n.left,10)+s)+"px",top:(n.top=="auto"?l.y-a.y+(t.offsetHeight>>1):parseInt(n.top,10)+s)+"px"})}r.setAttribute("role","progressbar");e.lines(r,e.opts);if(!i){var u=0,p=(n.lines-1)*(1-n.direction)/2,c,h=n.fps,m=h/n.speed,y=(1-n.opacity)/(m*n.trail/100),g=m/n.lines;(function v(){u++;for(var t=0;t<n.lines;t++){c=Math.max(1-(u+(n.lines-t)*g)%m*y,n.opacity);e.opacity(r,t*n.direction+p,c,n)}e.timeout=e.el&&setTimeout(v,~~(1e3/h))})()}return e},stop:function(){var t=this.el;if(t){clearTimeout(this.timeout);if(t.parentNode)t.parentNode.removeChild(t);this.el=undefined}return this},lines:function(t,e){var r=0,a=(e.lines-1)*(1-e.direction)/2,l;function d(t,i){return f(o(),{position:"absolute",width:e.length+e.width+"px",height:e.width+"px",background:t,boxShadow:i,transformOrigin:"left",transform:"rotate("+~~(360/e.lines*r+e.rotate)+"deg) translate("+e.radius+"px"+",0)",borderRadius:(e.corners*e.width>>1)+"px"})}for(;r<e.lines;r++){l=f(o(),{position:"absolute",top:1+~(e.width/2)+"px",transform:e.hwaccel?"translate3d(0,0,0)":"",opacity:e.opacity,animation:i&&s(e.opacity,e.trail,a+r*e.direction,e.lines)+" "+1/e.speed+"s linear infinite"});if(e.shadow)n(l,f(d("#000","0 0 4px "+"#000"),{top:2+"px"}));n(t,n(l,d(e.color,"0 0 1px rgba(0,0,0,.1)")))}return t},opacity:function(t,e,i){if(e<t.childNodes.length)t.childNodes[e].style.opacity=i}});function c(){function t(t,e){return o("<"+t+' xmlns="urn:schemas-microsoft.com:vml" class="spin-vml">',e)}r.addRule(".spin-vml","behavior:url(#default#VML)");p.prototype.lines=function(e,i){var o=i.length+i.width,r=2*o;function s(){return f(t("group",{coordsize:r+" "+r,coordorigin:-o+" "+-o}),{width:r,height:r})}var a=-(i.width+i.length)*2+"px",l=f(s(),{position:"absolute",top:a,left:a}),d;function u(e,r,a){n(l,n(f(s(),{rotation:360/i.lines*e+"deg",left:~~r}),n(f(t("roundrect",{arcsize:i.corners}),{width:o,height:i.width,left:i.radius,top:-i.width>>1,filter:a}),t("fill",{color:i.color,opacity:i.opacity}),t("stroke",{opacity:0}))))}if(i.shadow)for(d=1;d<=i.lines;d++)u(d,-2,"progid:DXImageTransform.Microsoft.Blur(pixelradius=2,makeshadow=1,shadowopacity=.3)");for(d=1;d<=i.lines;d++)u(d);return n(e,l)};p.prototype.opacity=function(t,e,i,o){var n=t.firstChild;o=o.shadow&&o.lines||0;if(n&&e+o<n.childNodes.length){n=n.childNodes[e+o];n=n&&n.firstChild;n=n&&n.firstChild;if(n)n.opacity=i}}}var h=f(o("group"),{behavior:"url(#default#VML)"});if(!a(h,"transform")&&h.adj)c();else i=a(h,"animation");return p});;