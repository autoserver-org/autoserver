'use strict';

const { isEqual } = require('lodash');

const { throwError } = require('../../../../../error');
const { assignArray } = require('../../../../../utilities');
const { ACTIONS } = require('../../../../../constants');

const resolveWrite = async function ({ actionsGroups, nextLayer, mInput }) {
  // Run write commands in parallel
  const responsesPromises = actionsGroups.map(actions => singleResolveWrite({
    actions,
    nextLayer,
    mInput,
  }));
  const responses = await Promise.all(responsesPromises);
  const responsesA = responses.reduce(assignArray, []);
  return responsesA;
};

const singleResolveWrite = async function ({
  actions,
  actions: [{
    actionConstant,
    actionConstant: { type: actionType },
    modelName,
  }],
  nextLayer,
  mInput,
}) {
  const { [actionType]: handler } = handlers;
  const argsA = handler.mergeArgs({ actions });

  const ids = handler.getIds({ args: argsA });
  if (ids.length === 0) { return []; }

  const argsB = handler.getCurrentData({ actions, args: argsA, ids });
  const actionPath = mergeActionPaths({ actions });
  const command = findCommand({ actionConstant });

  const mInputA = {
    ...mInput,
    action: actionConstant,
    actionPath,
    command,
    modelName,
    args: argsB,
  };
  const { response: { data: responses } } = await nextLayer(mInputA);

  const responsesA = getResponses({ actions, responses, ids, modelName });
  return responsesA;
};

const mergeDataArgs = function ({ actions }) {
  const newData = actions.map(action => action.args.data);

  const newDataA = removeDuplicates(newData);

  return { newData: newDataA };
};

const mergeFilterArgs = function ({ actions }) {
  const models = actions.map(({ currentData }) => currentData);

  const modelsA = removeDuplicates(models);
  const ids = modelsA.map(({ id }) => id);

  return { filter: { id: ids } };
};

const removeDuplicates = function (models) {
  const modelsA = models.reduce(assignArray, []);
  modelsA.forEach(validateId);

  const modelsB = modelsA.reduce(groupDuplicates, {});
  return Object.values(modelsB).map(getUniqueModel);
};

const validateId = function (model) {
  if (typeof model.id === 'string') { return; }

  const message = `A model in 'data' is missing an 'id' attribute: '${JSON.stringify(model)}'`;
  throwError(message, { reason: 'INPUT_VALIDATION' });
};

const groupDuplicates = function (modelsA, model) {
  const { id } = model;
  const { [id]: modelsB = [] } = modelsA;
  const modelsC = [...modelsB, model];
  return { ...modelsA, [id]: modelsC };
};

const getUniqueModel = function (models) {
  const [model] = models;
  validateDuplicates(models, model);
  return model;
};

const validateDuplicates = function (models, model) {
  const differentModel = models
    .slice(1)
    .find(modelA => !isEqual(modelA, model));
  if (differentModel === undefined) { return; }

  const message = `Two models in 'data' have the same 'id' but different attributes: '${JSON.stringify(model)}', '${JSON.stringify(differentModel)}'`;
  throwError(message, { reason: 'INPUT_VALIDATION' });
};

const getFilterIds = function ({ args: { filter: { id } } }) {
  return id;
};

const getDataIds = function ({ args: { newData } }) {
  return newData.map(({ id }) => id);
};

const getCurrentData = function ({ actions, args, ids }) {
  const currentData = actions
    .map(action => action.currentData)
    .reduce(assignArray, []);
  const currentDataA = ids.map(id => findCurrentData({ id, currentData }));

  return { ...args, currentData: currentDataA };
};

const findCurrentData = function ({ id, currentData }) {
  return currentData
    .find(currentDatum => currentDatum && currentDatum.id === id) || null;
};

const createHandler = {
  mergeArgs: mergeDataArgs,
  getIds: getDataIds,
  getCurrentData: ({ args }) => args,
};
const dataHandler = {
  mergeArgs: mergeDataArgs,
  getIds: getDataIds,
  getCurrentData,
};
const filterHandler = {
  mergeArgs: mergeFilterArgs,
  getIds: getFilterIds,
  getCurrentData,
};

const handlers = {
  create: createHandler,
  update: dataHandler,
  upsert: dataHandler,
  replace: dataHandler,
  delete: filterHandler,
};

const mergeActionPaths = function ({ actions }) {
  return actions
    .reduce(
      (actionPaths, { actionPath }) => [...actionPaths, actionPath.join('.')],
      [],
    )
    .join(', ');
};

const findCommand = function ({ actionConstant }) {
  const { command } = ACTIONS.find(action => actionConstant === action);
  return command;
};

const getResponses = function ({ actions, responses, ids, modelName }) {
  validateResponse({ ids, responses });

  return actions
    .map(getModels.bind(null, { responses, modelName }))
    .reduce(assignArray, []);
};

const getModels = function (
  { responses, modelName },
  { args, currentData, dataPaths, select },
) {
  const models = args.data || currentData;
  return models
    .map(findModel.bind(null, { responses, dataPaths, select, modelName }))
    .filter(({ path }) => path !== undefined);
};

const findModel = function (
  { responses, dataPaths, select, modelName },
  { id },
  index,
) {
  const model = responses.find(response => response.id === id);
  const path = dataPaths[index];
  return { path, model, modelName, select };
};

// Safety check to make sure there is no server-side bugs
const validateResponse = function ({ ids, responses }) {
  const sameLength = responses.length === ids.length;

  if (!sameLength) {
    const message = `'ids' and 'responses' do not have the same length`;
    throwError(message, { reason: 'UTILITY_ERROR' });
  }
};

module.exports = {
  resolveWrite,
};
