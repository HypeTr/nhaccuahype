const $ = document.querySelector.bind(document)
const $$ = document.querySelectorAll.bind(document)
const heading = $('header h2')
const cdThumb = $('.cd-thumb')
const audio = $('#audio')
const cd = $('.cd')
const playBtn = $('.btn-toggle-play')
const player = $('.player')
const progress = $('#progress')
const btnNext = $('.btn-next')
const btnPre = $('.btn-prev')
const btnRandom = $('.btn-random')
const btnRepeat = $('.btn-repeat')
const playlist = $('.playlist')
const app = {
  currentIndex: 0,
  isPlaying: false,
  isRandom: false,
  isRepeat: false,
  songs: [
    {
      name: '3107',
      singer: 'W/N, Duongg, Nâu',
      path: './resource_songs/3017.mp3',
      image: './image/3017_song.jpg',
    },
    {
      name: 'Đường tôi trở em về',
      singer: 'buitruonlinh',
      path: './resource_songs/duongtoitroemve.mp3',
      image: './image/duongtoitroemve.jpg',
    },
    {
      name: 'Sinh ra đã là thứ đối lập nhau',
      singer: 'Emcee L (Da LAB) ft. Badbies',
      path: './resource_songs/sinhradalathudoilapnhau.mp3',
      image: './image/sinhradalathudoilapnhau.jpg',
    },
    {
      name: 'Phố vắng',
      singer: 'Nheo ft. LT, Lai Xuân Tú',
      path: './resource_songs/phovang.mp3',
      image: './image/phovang.jpg',
    },
    {
      name: 'Noname #1',
      singer: 'Changg',
      path: './resource_songs/khongtua.mp3',
      image: './image/khongtua.jpg',
    },
    {
      name: 'Nàng thơ',
      singer: 'Hoàng Dũng',
      path: './resource_songs/nangtho.mp3',
      image: './image/nangtho.jpg',
    },
    {
      name: 'Táo',
      singer: 'Blue Tequila',
      path: './resource_songs/tao.mp3',
      image: './image/tao.jpg',
    },
  ],
  defineProperties: function () {
    Object.defineProperty(this, 'currentSong', {
      get: function () {
        return this.songs[this.currentIndex]
      },
    })
  },
  render: function () {
    const html = this.songs.map((song, index) => {
      return `<div class="song ${
        index == this.currentIndex ? 'active' : ''
      }" data-index = "${index}" >
      <div
        class="thumb"
        style="
          background-image: url('${song.image}');
        "
      ></div>
      <div class="body">
        <h3 class="title">${song.name}</h3>
        <p class="author">${song.singer}</p>
      </div>
      <div class="option">
        <i class="fas fa-ellipsis-h"></i>
      </div>
    </div>`
    })
    $('.playlist').innerHTML = html.join('')
  },
  handleEvents: function () {
    const _this = this
    const cdWidth = cd.offsetWidth
    document.onscroll = function () {
      const scrollTop = window.scrollY || document.documentElement.scrollTop
      const newScrollWidth = cdWidth - scrollTop
      cd.style.width = newScrollWidth > 0 ? newScrollWidth + 'px' : 0
      cd.style.opacity = newScrollWidth / cdWidth
    }
    const cdThumbAnimation = cdThumb.animate([{ transform: 'rotate(360deg' }], {
      duration: 10000,
      iterations: Infinity,
    })
    cdThumbAnimation.pause()
    playBtn.onclick = function () {
      if (_this.isPlaying == false) {
        audio.play()
        cdThumbAnimation.play()
      } else {
        audio.pause()
        cdThumbAnimation.pause()
      }
      audio.onplay = function () {
        _this.isPlaying = true
        player.classList.add('playing')
      }
      audio.onpause = function () {
        _this.isPlaying = false
        player.classList.remove('playing')
      }
    }
    audio.ontimeupdate = function () {
      if (audio.duration) {
        const progressPercent = Math.floor(
          (audio.currentTime / audio.duration) * 100,
        )
        progress.value = progressPercent
      }
    }
    progress.onchange = function (e) {
      const temp = (audio.duration * e.target.value) / 100
      audio.currentTime = temp
    }
    btnNext.onclick = function () {
      if (_this.isRandom) {
        _this.randomSong()
      } else _this.nextSong()
      _this.render()
      _this.scrolltoActiveSong()
      audio.play()
      cdThumbAnimation.play()
      // audio.pause()
    }
    btnPre.onclick = function () {
      if (_this.isRandom) {
        _this.randomSong()
      } else _this.preSong()
      _this.render()
      _this.scrolltoActiveSong()
      audio.play()
      cdThumbAnimation.play()
      // audio.pause()
    }
    btnRandom.onclick = function () {
      _this.isRandom = !_this.isRandom
      btnRandom.classList.toggle('active', _this.isRandom)
    }
    btnRepeat.onclick = function () {
      _this.isRepeat = !_this.isRepeat
      btnRepeat.classList.toggle('active', _this.isRepeat)
    }
    audio.onended = function () {
      if (_this.isRepeat) audio.play()
      else btnNext.click()
    }
    playlist.onclick = function (e) {
      const songNode = e.target.closest('.song:not(.active)')
      if (songNode) {
        _this.currentIndex = Number(songNode.dataset.index)
        _this.loadCurrentSong()
        _this.render()
        cdThumbAnimation.play()
        audio.play()
      }
    }
  },
  scrolltoActiveSong: function () {
    setTimeout(() => {
      $('.song.active').scrollIntoView({
        behavior: 'smooth',
        block: 'nearest',
      })
    }, 100)
  },
  nextSong: function () {
    this.currentIndex = (this.currentIndex + 1) % this.songs.length
    this.loadCurrentSong()
  },
  preSong: function () {
    this.currentIndex =
      (this.songs.length + this.currentIndex - 1) % this.songs.length
    this.loadCurrentSong()
  },
  randomSong: function () {
    var newIndex
    do {
      newIndex = Math.floor(Math.random() * this.songs.length)
    } while (newIndex == this.currentIndex)
    this.currentIndex = newIndex
    this.loadCurrentSong()
  },
  loadCurrentSong: function () {
    heading.textContent = this.currentSong.name
    cdThumb.style.backgroundImage = `url('${this.currentSong.image}')`
    audio.src = this.currentSong.path
  },
  start: function () {
    this.defineProperties()
    this.handleEvents()
    this.loadCurrentSong()
    this.render()
  },
}
app.start()
