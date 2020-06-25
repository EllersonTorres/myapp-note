let faliedLoadAttempts = 2;
let faliedSaveAttempts = 1;
export default class NoteService {
  static load() {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (faliedLoadAttempts > 1) {
          const notes = window.localStorage.getItem("notes");
          resolve(notes ? JSON.parse(notes) : []);
        } else {
          reject();
          faliedLoadAttempts++;
        }
      }, 2000);
    });
  }

  static save(notes) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (faliedSaveAttempts > 1) {
          window.localStorage.setItem("notes", JSON.stringify(notes));
          resolve();
        } else {
          reject();
          faliedSaveAttempts++;
        }
      }, 2000);
    });
  }
}
