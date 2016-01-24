/* @flow */
/**
 *  Copyright (c) 2015, Facebook, Inc.
 *  All rights reserved.
 *
 *  This source code is licensed under the BSD-style license found in the
 *  LICENSE file in the root directory of this source tree. An additional grant
 *  of patent rights can be found in the PATENTS file in the same directory.
 */

import {
  GraphQLInputObjectType,
  GraphQLNonNull,
  GraphQLObjectType,
  GraphQLString
} from 'graphql';

import type {
  GraphQLFieldConfig,
  InputObjectConfigFieldMap,
  GraphQLFieldConfigMap,
  GraphQLResolveInfo
} from 'graphql';

type subscriptionFn = (object: Object, info: GraphQLResolveInfo) => Object |
                  (object: Object, info: GraphQLResolveInfo) => Promise<Object>;

function resolveMaybeThunk<T>(thingOrThunk: T | () => T): T {
  return typeof thingOrThunk === 'function' ? thingOrThunk() : thingOrThunk;
}

/**
 * A description of a subscription consumable by subscriptionWithClientSubscriptionId
 * to create a GraphQLFieldConfig for that subscription.
 *
 * The inputFields and outputFields should not include `clientSubscriptionId`,
 * as this will be provided automatically.
 *
 * An input object will be created containing the input fields, and an
 * object will be created containing the output fields.
 *
 * mutateAndGetPayload will receieve an Object with a key for each
 * input field, and it should return an Object with a key for each
 * output field. It may return synchronously, or return a Promise.
 */
type SubscriptionConfig = {
  name: string,
  inputFields: InputObjectConfigFieldMap,
  outputFields: GraphQLFieldConfigMap,
  mutateAndGetPayload: subscriptionFn,
}

/**
 * Returns a GraphQLFieldConfig for the subscription described by the
 * provided SubscriptionConfig.
 */
export function subscriptionWithClientSubscriptionId(
  config: SubscriptionConfig
): GraphQLFieldConfig {
  var {name, inputFields, outputFields, mutateAndGetPayload} = config;
  var augmentedInputFields = () => ({
    ...resolveMaybeThunk(inputFields),
    clientSubscriptionId: {
      type: new GraphQLNonNull(GraphQLString)
    }
  });
  var augmentedOutputFields = () => ({
    ...resolveMaybeThunk(outputFields),
    clientSubscriptionId: {
      type: new GraphQLNonNull(GraphQLString)
    }
  });

  var outputType = new GraphQLObjectType({
    name: name + 'Payload',
    fields: augmentedOutputFields
  });

  var inputType = new GraphQLInputObjectType({
    name: name + 'Input',
    fields: augmentedInputFields
  });

  return {
    type: outputType,
    args: {
      input: {type: new GraphQLNonNull(inputType)}
    },
    resolve: (_, {input}, info) => {
      return Promise.resolve(mutateAndGetPayload(input, info)).then(payload => {
        payload.clientSubscriptionId = input.clientSubscriptionId;
        return payload;
      });
    }
  };
}
