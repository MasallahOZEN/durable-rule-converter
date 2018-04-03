'use strict';

/**
 * Adds commas to a number
 * @param {input} Rule output from jQuery QueryBuilder
 * @return {object}
 */
module.exports = function(input) {
    /** Settings **/
	var defaultCondition = 'AND';

	/** Private Functions **/
	var escapeRegExp = function(str) {
		return str.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, '\\$&');
	};

	var mongoOperators = {
		equal: '$eq',
		not_equal: '$ne',
		less: '$lt',
		less_or_equal: '$lte',
		greater: '$gt',
		greater_or_equal: '$gte'
	}

	var mongoOperatorsFns = {
		equal: function(v) {
			return {
				[v[0]]: v[1]
			};
		},
		not_equal: function(v) {
			return {
				[v[0]]: v[1]
			};
		},
		less: function(v) {
			return {
				[v[0]]: v[1]
			};
		},
		less_or_equal: function(v) {
			return {
				[v[0]]: v[1]
			};
		},
		greater: function(v) {
			return {
				[v[0]]: v[1]
			};
		},
		greater_or_equal: function(v) {
			return {
				[v[0]]: v[1]
			};
		}
	}

	var output = [];

	if (!input) {
		return null;
	}

	var self = this;

	if (input.condition && input.rules.length > 0) {
		var obj = {};
		obj = {
			[obj[input.condition]]: []
		}
		output.push(obj);
	}

	return (function parse(group) {

		if (!group.condition) {
			group.condition = defaultCondition;
		}

		if (['AND', 'OR'].indexOf(group.condition.toUpperCase()) === -1) {
			throw new Error('Unable to build rule with condition '+ group.condition);
		}

		if (!group.rules) {
			return {};
		}

		var parts = [];

		group.rules.forEach(function(rule) {
			if (rule.rules && rule.rules.length > 0) {
				parts.push(parse(rule));
			} else {
				var expFunction = mongoOperatorsFns[rule.operator];
				var ruleExpression = {};

				if (expFunction === undefined) {
					throw new Error('Unknown rule operation for operator ' + rule.operator);
				}

				ruleExpression[mongoOperators[rule.operator]] = expFunction.call(self, [rule.id, rule.value]);

				parts.push(ruleExpression);
			}
		});

		var groupExpression = {};

		groupExpression['$' + group.condition.toLowerCase()] = parts;

		return (groupExpression);

	})(input);
};