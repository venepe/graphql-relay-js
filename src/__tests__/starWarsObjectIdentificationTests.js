/**
 *  Copyright (c) 2015, Facebook, Inc.
 *  All rights reserved.
 *
 *  This source code is licensed under the BSD-style license found in the
 *  LICENSE file in the root directory of this source tree. An additional grant
 *  of patent rights can be found in the PATENTS file in the same directory.
 */

import { expect } from 'chai';
import { describe, it } from 'mocha';
import { StarWarsSchema } from './starWarsSchema.js';
import { graphql } from 'graphql';

// 80+ char lines are useful in describe/it, so ignore in this file.
/* eslint-disable max-len */

describe('Star Wars object identification', () => {
  it('fetches the ID and name of the rebels', async () => {
    var query = `
      query RebelsQuery {
        rebels {
          id
          name
        }
      }
    `;
    var expected = {
      rebels: {
        id: 'RmFjdGlvbjox',
        name: 'Alliance to Restore the Republic'
      }
    };
    var result = await graphql(StarWarsSchema, query);
    expect(result).to.deep.equal({ data: expected });
  });

  it('refetches the rebels', async () => {
    var query = `
      query RebelsRefetchQuery {
        node(id: "RmFjdGlvbjox") {
          id
          ... on Faction {
            name
          }
        }
      }
    `;
    var expected = {
      node: {
        id: 'RmFjdGlvbjox',
        name: 'Alliance to Restore the Republic'
      }
    };
    var result = await graphql(StarWarsSchema, query);
    expect(result).to.deep.equal({ data: expected });
  });

  it('fetches the ID and name of the empire', async () => {
    var query = `
      query EmpireQuery {
        empire {
          id
          name
        }
      }
    `;
    var expected = {
      empire: {
        id: 'RmFjdGlvbjoy',
        name: 'Galactic Empire'
      }
    };
    var result = await graphql(StarWarsSchema, query);
    expect(result).to.deep.equal({ data: expected });
  });

  it('refetches the empire', async () => {
    var query = `
      query EmpireRefetchQuery {
        node(id: "RmFjdGlvbjoy") {
          id
          ... on Faction {
            name
          }
        }
      }
    `;
    var expected = {
      node: {
        id: 'RmFjdGlvbjoy',
        name: 'Galactic Empire'
      }
    };
    var result = await graphql(StarWarsSchema, query);
    expect(result).to.deep.equal({ data: expected });
  });

  it('refetches the X-Wing', async () => {
    var query = `
      query XWingRefetchQuery {
        node(id: "U2hpcDox") {
          id
          ... on Ship {
            name
          }
        }
      }
    `;
    var expected = {
      node: {
        id: 'U2hpcDox',
        name: 'X-Wing'
      }
    };
    var result = await graphql(StarWarsSchema, query);
    expect(result).to.deep.equal({ data: expected });
  });
});
