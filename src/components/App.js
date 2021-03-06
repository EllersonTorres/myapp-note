import React, { Fragment } from "react";
import uuid from "uuid/dist/v1";
import NewNote from "./NewNote";
import NoteList from "./NoteList";
import AppBar from "./AppBar";
import NoteService from "../services/NoteService";
import Error from "./Error";
import NavigationDrawer from "./NavigationDrawer";

class App extends React.Component {
  state = {
    notes: [],
    isLoading: false,
    isMenuOpen: false,
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
    this.setState({ isLoading: true, saveHasError: false });
    NoteService.save(notes)
      .then(() => {
        this.setState({ isLoading: false });
      })
      .catch(() => {
        this.setState({ isLoading: false, saveHasError: true });
      });
  };

  handleOpenMenu = () => {
    this.setState({ isMenuOpen: true });
  };

  handleCloseMenu = () => {
    this.setState({ isMenuOpen: false });
  };

  render() {
    const {
      notes,
      isLoading,
      isMenuOpen,
      reloadHasError,
      saveHasError,
    } = this.state;
    return (
      <div>
        <AppBar
          isLoading={isLoading}
          saveHasError={saveHasError}
          onSaveRetry={() => {
            this.handleSave(notes);
          }}
          onOpenMenu={this.handleOpenMenu}
        />
        <div className="container">
          {reloadHasError ? (
            <Error onRetry={this.handleReload} />
          ) : (
            <Fragment>
              <NewNote onAddNote={this.handleAddNote} />
              <NoteList
                notes={notes}
                onMove={this.handleOnMove}
                onDelete={this.handleDelete}
                onEdit={this.handleEdit}
              />
            </Fragment>
          )}
        </div>
        <NavigationDrawer
          isOpen={isMenuOpen}
          onCloseMenu={this.handleCloseMenu}
        />
      </div>
    );
  }
}

export default App;
