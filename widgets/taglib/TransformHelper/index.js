/*
 * Copyright 2011 eBay Software Foundation
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
'use strict';

var WidgetArgs = require('./WidgetArgs');
var getRequirePath = require('../getRequirePath');
var buildWidgetTypeNode = require('../util/buildWidgetTypeNode');
var resolveFrom = require('resolve-from');

class TransformHelper {
    constructor(el, context) {
        this.el = el;
        this.context = context;
        this.builder = context.builder;
        this.dirname = context.dirname;

        this.widgetNextElId = 0;
        this.widgetIdInfo = undefined;
        this.widgetArgs = undefined;
        this.containingWidgetNode = undefined;
        this._markoWidgetsVar = context.data.markoWidgetsVar;
        this.widgetStack = context.data.widgetStack || (context.data.widgetStack = []);
    }

    addError(message, code) {
        this.context.addError(this.el, message, code);
    }

    getWidgetArgs() {
        return this.widgetArgs || (this.widgetArgs = new WidgetArgs());
    }

    nextUniqueId() {
        var widgetNextElId = this.context.data.widgetNextElId;
        if (widgetNextElId == null) {
            this.context.data.widgetNextElId = 0;
        }

        return (this.context.data.widgetNextElId++);
    }

    getNestedIdExpression() {
        this.assignWidgetId();
        return this.getWidgetIdInfo().nestedIdExpression;
    }

    getIdExpression() {
        this.assignWidgetId();
        return this.getWidgetIdInfo().idExpression;
    }

    getWidgetIdInfo() {
        return this.widgetIdInfo;
    }

    getDefaultWidgetModule() {
        var dirname = this.dirname;
        if (resolveFrom(dirname, './component')) {
            return './component';
        } else if (resolveFrom(dirname, './widget')) {
            return './widget';
        } else if (resolveFrom(dirname, './')) {
            return './';
        } else {
            return null;
        }
    }

    getMarkoWidgetsRequirePath(target) {
        return getRequirePath(target, this.context);
    }

    set markoWidgetsVar(value) {
        this._markoWidgetsVar = value;
    }

    get markoWidgetsVar() {
        if (!this._markoWidgetsVar) {
            this._markoWidgetsVar = this.context.importModule('marko_widgets', this.getMarkoWidgetsRequirePath('marko/widgets'));
        }

        return this._markoWidgetsVar;
    }

    buildWidgetElIdFunctionCall(id) {
        var builder = this.builder;

        var widgetElId = builder.memberExpression(
            builder.identifier('widget'),
            builder.identifier('elId'));

        return builder.functionCall(widgetElId, arguments.length === 0 ? [] : [ id ]);
    }

    buildWidgetTypeNode(path, def) {
        return buildWidgetTypeNode(path, this.dirname, def, this);
    }

    getTransformHelper(el) {
        return new TransformHelper(el, this.context);
    }
}

TransformHelper.prototype.assignWidgetId = require('./assignWidgetId');
TransformHelper.prototype.getContainingWidgetNode = require('./getContainingWidgetNode');
TransformHelper.prototype.handleIncludeNode = require('./handleIncludeNode');
TransformHelper.prototype.handleWidgetEvents = require('./handleWidgetEvents');
TransformHelper.prototype.handleWidgetPreserve = require('./handleWidgetPreserve');
TransformHelper.prototype.handleWidgetPreserveAttrs = require('./handleWidgetPreserveAttrs');
TransformHelper.prototype.handleWidgetBind = require('./handleWidgetBind');
TransformHelper.prototype.handleWidgetExtend = require('./handleWidgetExtend');
TransformHelper.prototype.handleWidgetFor = require('./handleWidgetFor');

module.exports = TransformHelper;