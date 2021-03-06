define([
  "app",
  "backbone",
  "core/entries/EntriesModel"
],

function(app, Backbone, EntriesModel) {
  var FilesModel = EntriesModel.extend({

    initialize: function() {
      EntriesModel.prototype.initialize.apply(this, arguments);
    },

    makeFileUrl: function(thumbnail) {
      var storageAdapters = app.storageAdapters,
          adapterId,
          storageAdapter,
          url;

      if(thumbnail) {
        adapterId = 'THUMBNAIL';
        if(!storageAdapters.hasOwnProperty(adapterId)) {
          throw new Error("Cannot find default thumbnail storage_adapter using key: " + adapterId);
        }

        storageAdapter = storageAdapters[adapterId];
        if(this.get('name')) {
          if($.inArray(this.get('name').split('.').pop(),['tif', 'tiff', 'psd', 'pdf']) > -1) {
            url = storageAdapter.url + this.get('id') + ".jpg";
          } else {
            url = storageAdapter.url + this.get('id') + "." + this.get('name').split('.').pop();
          }
        }

        //If Temp SA and Thumbnail do Special logic
        if(this.get('storage_adapter')) {
          if(storageAdapters[this.get('storage_adapter')].role == "TEMP" && thumbnail) {
            if($.inArray(this.get('name').split('.').pop(),['tif', 'tiff', 'psd', 'pdf']) > -1) {
              url = storageAdapters[this.get('storage_adapter')].url + "THUMB_" + this.get('name').replace(/\.[^/.]+$/, "") + ".jpg";
            } else {
              url = storageAdapters[this.get('storage_adapter')].url + "THUMB_" + this.get('name');
            }
          }
        }
      } else {
        adapterId = this.get('storage_adapter');
        if(!storageAdapters.hasOwnProperty(adapterId)) {
          throw new Error("Files record's storage_adapter FK value maps to an undefined directus_storage_adapters record: " + adapterId);
        }

        storageAdapter = storageAdapters[adapterId];
        url = storageAdapter.url + this.get('name');
      }

      return url;
    },

    constructor: function FilesModel(data, options) {
      FilesModel.__super__.constructor.call(this, data, options);
    }

  });

  return FilesModel;

});