(function() {
  function SongPlayer(Fixtures) {
    var SongPlayer = {};

    /** this sets the currentAlbum with the Fixtures service */
    var currentAlbum = Fixtures.getAlbum();

    var getSongIndex = function(song) {
      return currentAlbum.songs.indexOf(song);
    };
    /**
     * @desc Buzz object audio file
     * @type {Object}
     */
    var currentBuzzObject = null;

    /**
     * @function setSong
     * @desc Stops currently playing song and loads new audio file as currentBuzzObject
     * @param {Object} song
     */
    var setSong = function(song) {
      if (currentBuzzObject) {
        stopSong();
      }

      currentBuzzObject = new buzz.sound(song.audioUrl, {
        formats: ['mp3'],
        preload: true
      });

      SongPlayer.currentSong = song;
    };

    /**
     * @function playSong
     * @desc Plays the currentBuzzObject and sets the property of the song Object to true
     *param {Object} song
     */
    var playSong = function(song) {
      currentBuzzObject.play();
      song.playing = true;
    };

    var stopSong = function(song) {
      currentBuzzObject.stop();
      song.playing = null;
    };

    /**
     * @function SongPlayer.play
     * @desc Public method that takes a song object parameter. If the buzz object Song is not the same as the current
     * then a new song will load and play. If the buzz object Song is the same, and if it is paused, then the song will play.
     * @param {Object} song
     */
    SongPlayer.currentSong = null;

    SongPlayer.play = function(song) {
      song = song || SongPlayer.currentSong;
      if (SongPlayer.currentSong !== song) {
        setSong(song);
        playSong(song);
      } else if (SongPlayer.currentSong === song) {
        if (currentBuzzObject.isPaused()) {
          currentBuzzObject.play();
        }
      }
    };

    /**
     * @function SongPlayer.pause
     * @desc Public method. Takes a song object parameter. Pauses the currently playing Buzz Object
     * and sets the song's 'playing' attribute to false.
     * @param {Object} song
     */
    SongPlayer.pause = function(song) {
      song = song || SongPlayer.currentSong;
      currentBuzzObject.pause();
      song.playing = false;
    };

    SongPlayer.previous = function() {
      var currentSongIndex = getSongIndex(SongPlayer.currentSong);
      currentSongIndex--;

      if (currentSongIndex < 0) {
        currentBuzzObject.stop();
        SongPlayer.currentSong.playing = null;
      } else {
        var song = currentAlbum.songs[currentSongIndex];
        setSong(song);
        playSong(song);
      }
    };

    SongPlayer.next = function() {
      var currentSongIndex = getSongIndex(SongPlayer.currentSong);
      currentSongIndex++;

      if (currentSongIndex === currentAlbum.songs.length) {
        stopSong(SongPlayer.currentSong);
      } else {
        var song = currentAlbum.songs[currentSongIndex];
        setSong(song);
        playSong(song);
      }
    };

    return SongPlayer;
  }
  angular
    .module('blocJams')
    .factory('SongPlayer', ['Fixtures', SongPlayer]);
})();
