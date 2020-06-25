import React from "react";
import uuid from "uuid/dist/v1";
import NewNote from "./NewNote";
import NoteList from "./NoteList";
import AppBar from "./AppBar";
import NoteService from "../services/NoteService";
import Error from "./Error";

class App extends React.Component {
  state = {
    notes: [],
    isLoading: false,
    reloadHasError: false,
    saveHasError: false,
  };

  componentDidCatch() {
    this.setState({ reloadHasError: true });
  }
  componentDidMount() {
    this.handleReload();
  }

  handleAddNote = (text) => {
    this.setState((prevState) => {
      const notes = prevState.notes.concat({ id: uuid(), text });
      this.handleSave(notes);
      return { notes };
    });
  };

  handleOnMove = (direction, index) => {
    this.setState((prevState) => {
      const newNotes = prevState.notes.slice();
      const removeNote = newNotes.splice(index, 1)[0];

      if (direction === "up") {
        newNotes.splice(index - 1, 0, removeNote);
      } else {
        newNotes.splice(index + 1, 0, removeNote);
      }
      this.handleSave(newNotes);

      return {
        notes: newNotes,
      };
    });
  };

  handleDelete = (id) => {
    this.setState((prevState) => {
      const newNotes = prevState.notes.slice();
      const index = newNotes.findIndex((note) => note.id === id);
      newNotes.splice(index, 1)[0];
      this.handleSave(newNotes);
      return {
        notes: newNotes,
      };
    });
  };

  handleEdit = (id, text) => {
    this.setState((prevState) => {
      const newNotes = prevState.notes.slice();
      const index = newNotes.findIndex((note) => note.id === id);
      newNotes[index].text = text;
      this.handleSave(newNotes);
      return {
        notes: newNotes,
      };
    });
  };

  handleReload = () => {
    this.setState({ isLoading: true, reloadHasError: false });
    NoteService.load()
      .then((notes) => {
        this.setState({ notes, isLoading: false });
      })
      .catch(() => {
        this.setState({ isLoading: false, reloadHasError: true });
      });
  };

  handleSave = (notes) => {
    console.log(notes);
    //this.setState({ isLoading: true, saveHasError: false });
    console.log("depois");

    NoteService.save(notes)
      .then(() => {
        this.setState({ isLoading: false });
      })
      .catch(() => {
        this.setState({ isLoading: false, saveHasError: true });
      });
  };

  render() {
    const { notes, isLoading, reloadHasError, saveHasError } = this.state;
    return (
      <div>
        <AppBar
          isLoading={isLoading}
          SaveHasError={saveHasError}
          onSaveRetry={() => {
            this.handleSave(notes);
          }}
        />
        <div className="container">
          {reloadHasError ? (
            <Error onRetry={this.handleReload} />
          ) : (
            <React.Fragment>
              <NewNote onAddNote={this.handleAddNote} />
              <NoteList
                notes={notes}
                onMove={this.handleOnMove}
                onDelete={this.handleDelete}
                onEdit={this.handleEdit}
              />
            </React.Fragment>
          )}
        </div>
      </div>
    );
  }
}

export default App;
