SoundHub.PlaylistApp = function(){
	var tracks;
	var PlaylistApp = {};
	var currentTrackNum = 0;
	var currentTrack = function(){
		return tracks.at(currentTrackNum).get('id').toString();
	};
	var nextTrack = function(){
		return tracks.at(currentTrackNum + 1).get('id').toString();
	};
	var previousTrack = function(){
		return tracks.at(currentTrackNum - 1).get('id').toString();
	};


	var Track = Backbone.Model.extend({});
	var Tracks = Backbone.Collection.extend({
		model: Track
	});

	var TrackView = Backbone.Marionette.ItemView.extend({
		template: '#tracks_item_template',
		tagName: 'li',
		className: 'songBlock',
		events:{
			'click .albumArt': 'play',
			'click .remove': 'removeSong'
		},
		play: function(e){
			$("#"+currentTrack())
			.parent()
			.removeClass('currentTrack')
			.addClass('faded');
			SoundHub.SoundCloudAPI.playSong(this.model.id);
			$("#"+this.model.id)
			.parent()
			.addClass('currentTrack')
			.removeClass('faded');
			SoundHub.PlaylistApp.updatePlaylist();
		},
		removeSong: function(e){
			console.log('remove called');
			tracks.remove(this.model);
		}
	});

	var TracksView = Backbone.Marionette.CompositeView.extend({
		tagName: 'ul',
		id: 'playlist',
		template: '#tracks_template',
		itemView: TrackView
	});

	PlaylistApp.addSongToPlaylist = function(song){
		tracks.add(song);
		if(tracks.length === 1){
			console.log('there is one track in the playlist');
			$("#"+tracks.first().get('id')).parent().addClass('currentTrack');
			SoundHub.SoundCloudAPI.playSong(tracks.first().get('id'));
		}
	};
	PlaylistApp.nextSong = function(){
		$("#"+currentTrack())
		.parent()
		.removeClass('currentTrack')
		.addClass('faded');
		$("#"+nextTrack())
		.parent()
		.addClass('currentTrack');
		SoundHub.SoundCloudAPI.playSong(nextTrack());
		currentTrackNum++;
	};
	PlaylistApp.previousSong = function(){
		$("#"+currentTrack())
		.parent()
		.removeClass('currentTrack');
		$("#"+previousTrack())
		.parent()
		.removeClass('faded')
		.addClass('currentTrack');
		SoundHub.SoundCloudAPI.playSong(previousTrack());
		currentTrackNum--;
	};


	PlaylistApp.initializeLayout = function(options){
		//make new collection

		tracks = new Tracks();

		var tracksView = new TracksView({
			collection: tracks
		});

		SoundHub.playlistApp.show(tracksView);
	};
	PlaylistApp.updatePlaylist = function() {
		var passedCurrent = false;
		$('#playlist .songBlock').each(function(index, element) {
			if (!passedCurrent && $(element).hasClass('currentTrack')) {
				passedCurrent = true;
				currentTrackNum = index;
				$(element).removeClass('faded');
			} else {
				$(element).removeClass('currentTrack');
				if (passedCurrent) {
					$(element).removeClass('faded');
				} else {
					$(element).addClass('faded');
				}
			}
		});
	};

	PlaylistApp.tracksCount = function() {
		return tracks.length;
	};
	PlaylistApp.currentTrackNum = function() {
		return currentTrackNum;
	};

	return PlaylistApp;

}();