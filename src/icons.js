import Vue from 'vue'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { library } from '@fortawesome/fontawesome-svg-core'

import { faTwitter } from '@fortawesome/free-brands-svg-icons'
import { faImage, faToggleOn, faToggleOff, faUndo, faPause, faEdit, faCog, faPencilAlt, faPlay, faCaretUp, faCaretDown, faCoffee, faStepBackward, faStepForward, faComment, faQuoteLeft, faLock, faEllipsisH, faTimes, faWrench, faPlus, faReply, faHeart, faAngleLeft, faAngleDown, faCircle, faExpand, faSync, faArrowLeft, faArrowRight, faCheck, faStar, faChevronDown, faChevronUp, faCircleNotch } from '@fortawesome/free-solid-svg-icons'

library.add(faImage, faToggleOn, faToggleOff, faUndo, faPause, faEdit, faCog, faPencilAlt, faPlay, faCaretUp, faCaretDown, faCoffee, faStepBackward, faStepForward, faComment, faQuoteLeft, faLock, faEllipsisH, faTimes, faWrench, faPlus, faReply, faHeart, faAngleLeft, faAngleDown, faCircle, faExpand, faSync, faArrowLeft, faArrowRight, faCheck, faStar, faChevronDown, faChevronUp, faCircleNotch, faTwitter)

Vue.component('icon', FontAwesomeIcon)