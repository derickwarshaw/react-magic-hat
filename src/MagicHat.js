import React from 'react'
import PropTypes from 'prop-types'
import MagicHatNoState from './MagicHatNoState'

export default class MagicHat extends React.Component {
  static propTypes = {
    renderFrame: PropTypes.func.isRequired,
    onStartAnimation: PropTypes.func,
    onEndAnimation: PropTypes.func,
    flipMoveOptions: PropTypes.func,
    singleFrame: PropTypes.bool,
    moveSeed: PropTypes.string
  }

  state = {
    activePage: 1,
    pages: [
      {
        id: '',
        page: 1,
        state: {}
      }
    ]
  }

  getFrame = page => {
    return this.state.pages[page - 1] || {}
  }

  setContent = (page, payload = {}) => {
    this.setState(prevState => {
      const pages = [...prevState.pages]
      const pageIndex = page - 1

      const mergedPayload = {...pages[pageIndex], ...payload, page}

      pages.splice(pageIndex, 1, mergedPayload)

      return {
        pages,
        activePage: page
      }
    })
  }

  sliceFrame = page => {
    this.setState(prevState => {
      const pages = [...prevState.pages]
      const pageIndex = page - 1

      pages.splice(pageIndex, 1, {})

      return {
        pages: pages.slice(0, pageIndex + 1, {}),
        activePage: page - 1
      }
    })
  }

  connectFrame = ({page, activePage}) => {
    const {setContent, getFrame, sliceFrame} = this

    const frame = getFrame(page)

   

    const nextPage = page + 1

    const actions = {
      setCurrentFrame: state => setContent(page, {state}),
      getCurrentFrame: () => getFrame(page),
      closeCurrentFrame: () => sliceFrame(page),

      setNextFrame: (id, state) => setContent(nextPage, {id, state}),
      getNextFrame: () => getFrame(nextPage),
      closeNextFrame: () => sliceFrame(nextPage),

      setFrame: (page, id, state) => setContent(page, {id, state}),
      getFrame: page => getFrame(page),
      closeFrame: page => sliceFrame(page)
    }

    return this.props.renderFrame({
      activePage,
      ...frame,
      actions
    })
  }

  onEndAnimation = (childElements, domElements) => {
    this.setState(
      prevState => {
        return {
          pages: prevState.pages.filter(page => page.page)
        }
      },
      () => this.props.onEndAnimation(childElements, domElements, this.state)
    )
  }

  render = () => (
    <MagicHatNoState
      {...this.state}
      {...this.props}
      renderFrame={this.connectFrame}
      onEndAnimation={this.onEndAnimation}
    />
  )
}
