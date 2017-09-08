<template>
  <transition name="fade" mode="out-in">
    <main v-if="isLoggedIn === null">
      <loading />
    </main>
    <main v-else-if="isLoggedIn">
      <navigation />
      <transition name="slide-fade" mode="out-in">
        <router-view></router-view>
      </transition>
    </main>
    <login v-else/>
</transition>
</template>

<script>
import { mapState } from 'vuex'
import store, { SET_CSRF_TOKEN } from '@/store'
import Login from '@/views/Login'
import Loading from '@/views/Loading'
import Navigation from '@/components/Navigation'

export default {
  created() {
    fetch('/token', { credentials: 'same-origin' })
      .then(res => res.json())
      .then(json => store.dispatch(SET_CSRF_TOKEN, json.csrfToken))
  },
  computed: mapState({
    isLoggedIn: state =>
      state.facebookId == null ? null : state.facebookId !== 0,
  }),
  components: {
    Login,
    Loading,
    Navigation,
  },
}
</script>

<style lang="scss">
@import "../node_modules/bulma/sass/utilities/initial-variables";

$family-serif: Helvetica, Arial, sans-serif;
$primary: #5e9eff;
$primary-invert: #fff;
$family-primary: $family-serif;
$modal-content-width: 480px;

@import "../node_modules/bulma/bulma";

#app {
  text-align: center;
  color: #404040;
}

html {
  background: $white-ter;
  overflow-x: hidden;
}

.loading-overlay, .loading-background {
  background: $white-ter !important;
}

a {
  text-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  transition: all 0.3s;
}

a:hover {
  transform: translateY(-1px);
  text-shadow: 0 3px 8px rgba(0, 0, 0, 0.1);
}

.button {
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1), 0 0 0 1px rgba(0, 0, 0, 0.1);
  transition: all 0.3s;
}

.button:hover {
  transform: translateY(-1px);
  box-shadow: 0 3px 8px rgba(0, 0, 0, 0.1), 0 0 0 1px rgba(0, 0, 0, 0.1);
}

.modal {
  z-index: 1001;
}

.modal-card-foot {
  justify-content: flex-end;
}

.modal-body-indent {
  margin-left: 1rem;
}

.sk-folding-cube {
  margin: 20px auto;
  width: 40px;
  height: 40px;
  position: relative;
  -webkit-transform: rotateZ(45deg);
          transform: rotateZ(45deg);
}

.sk-folding-cube .sk-cube {
  float: left;
  width: 50%;
  height: 50%;
  position: relative;
  -webkit-transform: scale(1.1);
      -ms-transform: scale(1.1);
          transform: scale(1.1);
}
.sk-folding-cube .sk-cube:before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: $primary;
  -webkit-animation: sk-foldCubeAngle 2.4s infinite linear both;
          animation: sk-foldCubeAngle 2.4s infinite linear both;
  -webkit-transform-origin: 100% 100%;
      -ms-transform-origin: 100% 100%;
          transform-origin: 100% 100%;
}
.sk-folding-cube .sk-cube2 {
  -webkit-transform: scale(1.1) rotateZ(90deg);
          transform: scale(1.1) rotateZ(90deg);
}
.sk-folding-cube .sk-cube3 {
  -webkit-transform: scale(1.1) rotateZ(180deg);
          transform: scale(1.1) rotateZ(180deg);
}
.sk-folding-cube .sk-cube4 {
  -webkit-transform: scale(1.1) rotateZ(270deg);
          transform: scale(1.1) rotateZ(270deg);
}
.sk-folding-cube .sk-cube2:before {
  -webkit-animation-delay: 0.3s;
          animation-delay: 0.3s;
}
.sk-folding-cube .sk-cube3:before {
  -webkit-animation-delay: 0.6s;
          animation-delay: 0.6s;
}
.sk-folding-cube .sk-cube4:before {
  -webkit-animation-delay: 0.9s;
          animation-delay: 0.9s;
}
@-webkit-keyframes sk-foldCubeAngle {
  0%, 10% {
    -webkit-transform: perspective(140px) rotateX(-180deg);
            transform: perspective(140px) rotateX(-180deg);
    opacity: 0;
  } 25%, 75% {
    -webkit-transform: perspective(140px) rotateX(0deg);
            transform: perspective(140px) rotateX(0deg);
    opacity: 1;
  } 90%, 100% {
    -webkit-transform: perspective(140px) rotateY(180deg);
            transform: perspective(140px) rotateY(180deg);
    opacity: 0;
  }
}

@keyframes sk-foldCubeAngle {
  0%, 10% {
    -webkit-transform: perspective(140px) rotateX(-180deg);
            transform: perspective(140px) rotateX(-180deg);
    opacity: 0;
  } 25%, 75% {
    -webkit-transform: perspective(140px) rotateX(0deg);
            transform: perspective(140px) rotateX(0deg);
    opacity: 1;
  } 90%, 100% {
    -webkit-transform: perspective(140px) rotateY(180deg);
            transform: perspective(140px) rotateY(180deg);
    opacity: 0;
  }
}

.slide-fade-enter-active, .slide-fade-leave-active {
  transition: all .25s ease;
}

.slide-fade-enter, .slide-fade-leave-to {
  transform: translateY(10px);
  opacity: 0;
}

.modal-background {
  background-color: rgba(10, 10, 10, 0.70);
}

.fade-enter-active, .fade-leave-active {
  transition: all .25s ease;
}

.fade-enter, .fade-leave-to {
  opacity: 0;
}
</style>
