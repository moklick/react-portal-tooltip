import React, {PropTypes} from 'react'
import isClient from 'is-client'
import assign from 'object-assign'

class Card extends React.Component {
  static PropTypes = {
    active: PropTypes.bool,
    position: PropTypes.oneOf([
      'top',
      'right',
      'bottom',
      'left'
    ]),
    arrow: PropTypes.oneOf([
      null,
      'center',
      'top',
      'right',
      'bottom',
      'left'
    ])
  }
  static defaultProps = {
    active: false,
    position: 'right',
    arrow: null
  }
  state = {
    hover: false,
    transition: 'opacity',
    width: 0,
    height: 0
  }
  margin = 15
  get style() {
    if (!this.props.parentEl) {
      return {display: 'none'}
    }

    let style = {
      position: 'absolute',
      padding: '5px',
      background: '#fff',
      boxShadow: '0 0 8px rgba(0,0,0,.3)',
      borderRadius: '3px',
      transition: `${this.state.transition} .3s ease-in-out, visibility .3s ease-in-out`,
      opacity: this.state.hover || this.props.active ? 1 : 0,
      visibility: this.state.hover || this.props.active ? 'visible' : 'hidden',
      zIndex: 50
    }

    assign(style, this.getStyle(this.props.position, this.props.arrow))

    return style
  }
  get baseArrowStyle() {
    return {
      position: 'absolute',
      content: '""',
      transition: 'all .3s ease-in-out'
    }
  }
  get arrowStyle() {
    let fgStyle = this.baseArrowStyle
    let bgStyle = this.baseArrowStyle
    fgStyle.zIndex = 60
    bgStyle.zIndex = 55

    let fgColorBorder = '10px solid #fff'
    let fgTransBorder = '8px solid transparent'
    let bgColorBorder = '11px solid rgba(0,0,0,.4)'
    let bgTransBorder = '9px solid transparent'

    let {position, arrow} = this.props

    if (position === 'left' || position === 'right') {
      fgStyle.top = '50%'
      fgStyle.borderTop = fgTransBorder
      fgStyle.borderBottom = fgTransBorder
      fgStyle.marginTop = -7

      bgStyle.borderTop = bgTransBorder
      bgStyle.borderBottom = bgTransBorder
      bgStyle.top = '50%'
      bgStyle.marginTop = -8

      if (position === 'left') {
        fgStyle.right = -10
        fgStyle.borderLeft = fgColorBorder
        bgStyle.right = -11
        bgStyle.borderLeft = bgColorBorder
      }
      else {
        fgStyle.left = -10
        fgStyle.borderRight = fgColorBorder
        bgStyle.left = -11
        bgStyle.borderRight = bgColorBorder
      }

      if (arrow === 'top') {
        fgStyle.top = this.margin
        bgStyle.top = this.margin
      }
      if (arrow === 'bottom') {
        fgStyle.top = null
        fgStyle.bottom = this.margin + 1
        bgStyle.top = null
        bgStyle.bottom = this.margin
      }
    }
    else {
      fgStyle.left = '50%'
      fgStyle.marginLeft = -10
      fgStyle.borderLeft = fgTransBorder
      fgStyle.borderRight = fgTransBorder
      bgStyle.left = '50%'
      bgStyle.marginLeft = -11
      bgStyle.borderLeft = bgTransBorder
      bgStyle.borderRight = bgTransBorder

      if (position === 'top') {
        fgStyle.bottom = -10
        fgStyle.borderTop = fgColorBorder
        bgStyle.bottom = -11
        bgStyle.borderTop = bgColorBorder
      }
      else {
        fgStyle.top = -10
        fgStyle.borderBottom = fgColorBorder
        bgStyle.top = -11
        bgStyle.borderBottom = bgColorBorder
      }

      if (arrow === 'right') {
        fgStyle.left = null
        fgStyle.right = this.margin + 1
        fgStyle.marginLeft = 0
        bgStyle.left = null
        bgStyle.right = this.margin
        bgStyle.marginLeft = 0
      }
      if (arrow === 'left') {
        fgStyle.left = this.margin + 1
        fgStyle.marginLeft = 0
        bgStyle.left = this.margin
        bgStyle.marginLeft = 0
      }
    }

    return {fgStyle, bgStyle}
  }
  getStyle(position, arrow) {
    let parent = this.props.parentEl
    let tooltipPosition = parent.getBoundingClientRect()
    let top = window.scrollY + tooltipPosition.top
    let left = window.scrollX + tooltipPosition.left
    let style = {}

    switch (position) {
      case 'left':
        style.top = (top + parent.offsetHeight / 2) - ((this.state.height) / 2)
        style.left = left - this.state.width - this.margin

        if (arrow) {
          switch (arrow) {
            case 'top':
              style.top = (top + parent.offsetHeight / 2) - this.margin
              style.left = left - this.state.width - this.margin
              break

            case 'bottom':
              style.top = (top + parent.offsetHeight / 2) - this.state.height + this.margin
              style.left = left - this.state.width - this.margin
              break
          }
        }
        break

      case 'right':
        style.top = (top + parent.offsetHeight / 2) - ((this.state.height) / 2)
        style.left = left + parent.offsetWidth + this.margin

        if (arrow) {
          switch (arrow) {
            case 'top':
              style.top = (top + parent.offsetHeight / 2) - this.margin
              style.left = left + parent.offsetWidth + this.margin
              break

            case 'bottom':
              style.top = (top + parent.offsetHeight / 2) - this.state.height + this.margin
              style.left = left + parent.offsetWidth + this.margin
              break
          }
        }
        break

      case 'top':
        style.left = left - (this.state.width / 2) + parent.offsetWidth / 2
        style.top = top - this.state.height - this.margin

        if (arrow) {
          switch(arrow) {
            case 'right':
              style.left = left - this.state.width + parent.offsetWidth / 2 + this.margin
              style.top = top - this.state.height - this.margin
              break

            case 'left':
              style.left = left + parent.offsetWidth / 2 - this.margin
              style.top = top - this.state.height - this.margin
              break
          }
        }
        break

      case 'bottom':
        style.left = left - (this.state.width / 2) + parent.offsetWidth / 2
        style.top = top + parent.offsetHeight + this.margin

        if (arrow){
          switch (arrow) {
            case 'right':
              style.left = left - this.state.width + parent.offsetWidth / 2 + this.margin
              style.top = top + parent.offsetHeight + this.margin
              break

            case 'left':
              style.left = left + parent.offsetWidth / 2 - this.margin
              style.top = top + parent.offsetHeight + this.margin
              break
          }
        }
        break
    }

    return style
  }
  checkWindowPosition(style, arrowStyle) {
    if (this.props.position === 'top' || this.props.position === 'bottom') {
      if (style.left < 0) {
        let offset = style.left
        style.left = this.margin

        if (this.props.arrow === 'right') {
          arrowStyle.fgStyle.marginRight = -(offset - this.margin + 10)
          arrowStyle.bgStyle.marginRight = -(offset - this.margin + 10)
        }
        else {
          arrowStyle.fgStyle.marginLeft += offset - this.margin
          arrowStyle.bgStyle.marginLeft += offset - this.margin
        }
      }
      else {
        let rightOffset = style.left + this.state.width - window.innerWidth
        if (rightOffset > 0) {
          let originalLeft = style.left
          style.left = window.innerWidth - this.state.width - this.margin
          arrowStyle.fgStyle.marginLeft += originalLeft - style.left
          arrowStyle.bgStyle.marginLeft += originalLeft - style.left
        }
      }
    }

    return {style, arrowStyle}
  }
  handleMouseEnter() {
    this.props.active && this.setState({hover: true})
  }
  handleMouseLeave() {
    this.setState({hover: false})
  }
  componentDidMount() {
    this.updateSize()
  }
  componentWillReceiveProps() {
    this.updateSize()
    this.setState({transition: this.state.hover || this.props.active ? 'all' : 'opacity'})
  }
  updateSize() {
    let self = React.findDOMNode(this)
    this.setState({
      width: self.offsetWidth,
      height: self.offsetHeight
    })
  }
  render() {
    let {style, arrowStyle} = this.checkWindowPosition(this.style, this.arrowStyle)

    return (
      <div style={style} onMouseEnter={::this.handleMouseEnter} onMouseLeave={::this.handleMouseLeave}>
        {this.props.arrow ? (
          <div>
            <span style={arrowStyle.fgStyle}/>
            <span style={arrowStyle.bgStyle}/>
          </div>)
          : null
        }
        {this.props.children}
      </div>
    )
  }
}

var portalNodes = {}

export default class ToolTip extends React.Component {
  static defaultProps = {
    active: false,
    group: 'main'
  }
  static propTypes = {
    active: PropTypes.bool,
    group: PropTypes.string
  }
  componentDidMount() {
    if (!this.props.active) {
      return
    }

    if (isClient()) {
      this.renderPortal(this.props)
    }
  }
  componentWillReceiveProps(nextProps) {
    if ((!portalNodes[this.props.group] && !nextProps.active)) {
      return
    }

    let newProps = nextProps
    if (portalNodes[this.props.group] && portalNodes[this.props.group].timeout) {
      clearTimeout(portalNodes[this.props.group].timeout)
    }

    if (this.props.active && !nextProps.active) {
      newProps.active = true
      portalNodes[this.props.group].timeout = setTimeout(() => {
        nextProps.active = false
        this.renderPortal(nextProps)
      }, 500)
    }

    this.renderPortal(newProps)
  }
  componentWillUnmount() {
    portalNodes[this.props.group] && React.unmountComponentAtNode(portalNodes[this.props.group].el)
  }
  createPortal() {
    portalNodes[this.props.group] = {
      el: document.createElement('div'),
      timeout: false
    }
    portalNodes[this.props.group].el.className = 'ToolTipPortal'
    document.body.appendChild(portalNodes[this.props.group].el)
  }
  renderPortal(props) {
    if (!portalNodes[this.props.group]) {
      this.createPortal()
    }
    let {parent, ...other} = props
    let parentEl = document.querySelector(parent)
    React.render(<Card parentEl={parentEl} {...other}/>, portalNodes[this.props.group].el)
  }
  shouldComponentUpdate() {
    return false
  }
  render() {
    return null
  }
}
