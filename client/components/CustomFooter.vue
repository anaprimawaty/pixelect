<template>
  <footer class="footer">
    <div class="container">
      <section class="section">
        <div class="level">
          <div class="level-left bottom-nav">
            <div class="level-item">
              <router-link :to="`/terms`"><strong>Terms</strong></router-link>
            </div>
            <div class="level-item">
                <router-link :to="`/privacy`"><strong>Privacy</strong></router-link>
            </div>
          </div>
          <div class="level-right">
            <div class="level-item">
              <p>© 2017 Pixelect</p>
            </div>
            <div class="level-item">
              <iframe src="https://www.facebook.com/plugins/like.php?href=https%3A%2F%2Fwww.pixelect.me&width=106&layout=button_count&action=like&size=small&show_faces=false&share=true&height=46&appId=2034722683480772" width="116" height="21" style="border:none;overflow:hidden;margin-top:0.2rem;" scrolling="no" frameborder="0" allowTransparency="true"></iframe>
            </div>


          </div>
        </div>
      </section>
    </div>
  </footer>
</template>

<script>
export default {}
</script>

<style scoped>
.footer {
  /*background-color: white;
  box-shadow: rgba(0, 0, 0, 0.5) 0 0 5px;*/
  padding-top: 2rem;
  padding-bottom: 3rem;
}
.section {
  padding-top: 0rem;
  padding-bottom: 0rem;
}
.bottom-nav .level-item {
  margin-right: 1.5rem;
}
</style>