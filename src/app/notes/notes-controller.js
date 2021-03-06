(function () {
  'use strict';

  angular.module('noterious')
    .controller('NotesCtrl', ['BoardsModel', 'NotesModel', '$state', NotesCtrl]);

  function NotesCtrl (BoardsModel, NotesModel, $state) {
    var self = this;

    var boardId = $state.params.boardId;

    self._init = function () {
      self.resetForm();
    };

    self.goBack = function() {
      $state.go('boards');
    };

    self.resetForm = function () {
      self.loading = false;
      self.newNote = {
        title: '',
        content: ''
      };
    };

    self.getBoard = function () {
      BoardsModel.fetch(boardId)
        .then(function (board) {
          self.board = board;
          self.notes = board.notes;
        }, function (reason) {
          //
        });
    };

    self.createNote = function (note, isValid) {
      if (isValid) {
        self.loading = true;

        note.board = boardId;
        NotesModel.create(note)
          .then(function (result) {
            self.getBoard();
          })
          .catch(function (reason) {
            //
          })
          .finally(function() {
            self.resetForm();
          });
      }
    };

    self.updateNote = function (noteId, note, isValid) {
      if (isValid) {
        self.loading = true;

        NotesModel.update(noteId, note)
          .then(function () {
            self.getBoard();
          })
          .catch(function (reason) {
            //
          })
          .finally(function() {
            self.resetForm();
          });
      }
    };

    self.deleteNote = function (noteId) {
      NotesModel.destroy(noteId)
        .then(function (result) {
          self.getBoard();
        })
        .catch(function (reason) {
          //
        })
        .finally(function() {
          self.cancelEditing();
        });
    };

    self.setEditedNote = function(noteId, note) {
      self.editedNoteId = noteId;
      self.editedNote = angular.copy(note);
      self.isEditing = true;
    };

    self.isCurrentNote = function(noteId) {
      return self.editedNote !== null && self.editedNoteId === noteId;
    };

    self.cancelEditing = function() {
      self.loading = false;
      self.editedNoteId = null;
      self.editedNote = null;
      self.isEditing = false;
    };

    self.s3FileUpload = function(fileName, fileData, note){
      NotesModel.s3FileUpload(fileName, fileData)
          .then(function(res){
            //update the URL in the note and save
            note.image = res.data.url;
            self.updateNote(note.id, note, true)
          })
          .catch(function (err) {
            console.log("err in upload" + err)
          })
    }

    self.getBoard();
  }

})();