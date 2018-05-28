'use strict';

import faker from 'faker';
import Song from '../../model/song';
import { pCreateAccountMock, pRemoveAccountMock } from './account-mock';


const pCreateSongMock = () => {
  const resultMock = {};

  return pCreateAccountMock()
    .then((accountSetMock) => {
      resultMock.accountSetMock = accountSetMock;

      return new Song({
        song: faker.lorem.words(10),
        artist: faker.random.words(2),
        genre: faker.random.words(1),
        length: faker.random.words(1),

        account: accountSetMock.account._id, // this line sets up the relationship
      }).save();
    })
    .then((song) => {
      resultMock.song = song;
      return resultMock;
    });
};

const pRemoveSongMock = () => {
  return Promise.all([
    Song.remove({}),
    pRemoveAccountMock(),
  ]);
};

export { pCreateSongMock, pRemoveSongMock };
