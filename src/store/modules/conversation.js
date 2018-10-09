import Vue from 'vue'
import * as types from '@/store/mutation-types'

import findIndex from 'lodash/findIndex'

// initial state
const state = {
  isCollapsed: true,
  activeSegment: undefined,
  peekSegment: undefined,
  activeSegmentMessages: [],
  replyingTo: undefined,
  subscribedTo: undefined,
  twitterEnabled: true,
  infoModal: {
    visible: false,
    content: {
      title: undefined,
      body: undefined,
      action: undefined
    }
  },
  questionModal: {
    visible: false,
    content: {
      title: undefined,
      body: undefined,
      action: undefined
    }
  },
  mediaUploadModal: {
    visible: false,
    content: {
      title: undefined,
      body: undefined,
      action: undefined
    }
  },
  isEditing: false,
  editingMode: undefined,
  editingSegment: undefined
}

// getters
const getters = {
  isCollapsed: (initialState) => initialState.isCollapsed,
  subscribedTo: (initialState) => initialState.subscribedTo,
  twitterEnabled: (initialState) => initialState.twitterEnabled,
  activeSegment: (initialState) => initialState.activeSegment,
  peekSegment: (initialState) => initialState.peekSegment,
  activeSegmentMessages: (initialState) => initialState.activeSegmentMessages,
  replyingTo: (initialState) => initialState.replyingTo,
  infoModalVisible: (initialState) => initialState.infoModal.visible,
  infoModal: (initialState) => initialState.infoModal.content,
  questionModalVisible: (initialState) => initialState.questionModal.visible,
  questionModal: (initialState) => initialState.questionModal.content,
  mediaUploadModalVisible: (initialState) => initialState.mediaUploadModal.visible,
  mediaUploadModal: (initialState) => initialState.mediaUploadModal.content,
  modalVisible() {
    return state.infoModal.visible || state.questionModal.visible || state.mediaUploadModal.visible
  },
  isEditing: (initialState) => initialState.isEditing,
  editingMode: (initialState) => initialState.editingMode,
  editingSegment: (initialState) => initialState.editingSegment
}

// actions
const actions = {
  showQuestionModal({ commit }, request) {
    commit('SHOW_QUESTION_MODAL', request)
  },
  showMediaUploadModal({ commit }, request) {
    commit('SHOW_MEDIA_UPLOAD_MODAL', request)
  }
}

// mutations
const mutations = {
  [types.GET_VISUALISATION_SUCCESS](initialState, { response }) {
    state.visualisation = response.data
  },
  [types.GET_VISUALISATION_FAILURE](initialState, { response }) {
    Vue.$log.info('error')
    state.visualisation = []
    // error in response
  },
  [types.GET_MESSAGES_SUCCESS](initialState, { response }) {
    const startSegmentGroup = parseInt(response.scope.startsegment)
    const endSegmentGroup = parseInt(response.scope.endsegment)

    for (var group in response.data) {

      const segmentGroup = parseInt(group)
      let newMessage = response.data[group]
      newMessage.segmentGroup = segmentGroup

      Vue.set(state.messages, segmentGroup, newMessage)
    }
  },
  [types.SET_ACTIVE_SEGMENT](initialState, activeSegment) {
    state.activeSegment = activeSegment
  },
  [types.SET_PEEK_SEGMENT](initialState, peekSegment) {
    state.peekSegment = peekSegment
  },
  [types.SET_SUBSCRIBED_TO](initialState, subscribedTo) {
    state.subscribedTo = subscribedTo
  },
  [types.SET_SEGMENT_MESSAGES](initialState, messages) {
    state.activeSegmentMessages = messages
  },
  [types.PUSH_SEGMENT_MESSAGE](initialState, newMessage) {
    if (newMessage.replyTo) {
      // A reply so push to message replies
      const index = findIndex(state.activeSegmentMessages, function (message) { return message.id == newMessage.replyTo })
      state.activeSegmentMessages[index]._replies.push(newMessage)
    } else {
      // Not a reply so just push onto array
      state.activeSegmentMessages.push(newMessage)
    }
  },
  [types.SET_REPLYING_TO](initialState, message) {
    state.replyingTo = message
  },
  [types.SET_TWITTER_ENABLED](initialState, enabled) {
    state.twitterEnabled = enabled
  },
  [types.SHOW_INFO_MODAL](initialState, params) {
    state.infoModal.content = params
    state.infoModal.visible = true
  },
  [types.DISMISS_INFO_MODAL](initialState) {
    state.infoModal.visible = false
  },
  [types.SHOW_QUESTION_MODAL](initialState, params) {
    state.questionModal.content = params
    state.questionModal.visible = true
  },
  [types.DISMISS_QUESTION_MODAL](initialState) {
    state.questionModal.visible = false
  },
  [types.SHOW_MEDIA_UPLOAD_MODAL](initialState, params) {
    state.mediaUploadModal.content = params
    state.mediaUploadModal.visible = true
  },
  [types.DISMISS_MEDIA_UPLOAD_MODAL](initialState) {
    state.mediaUploadModal.visible = false
  },
  [types.EXPAND_CONVERSATION](initialState) {
    state.isCollapsed = false
  },
  [types.COLLAPSE_CONVERSATION](initialState) {
    state.isCollapsed = true
  },
  [types.IS_EDITING](initialState, isEditing) {
    state.isEditing = isEditing
  },
  [types.EDITING_MODE](initialState, editingMode) {
    state.editingMode = editingMode
  },
  [types.EDITING_SEGMENT](initialState, segmentGroup) {
    state.editingSegment = segmentGroup
  }
}

export default {
  state,
  getters,
  actions,
  mutations
}
