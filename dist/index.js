function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

import React, { useState } from "react";
import NumberFormat from "react-number-format";

const withChange = WrappedComponent => {
  return ({
    delay,
    onChange,
    timeout = 200,
    ...props
  }) => {
    const [timer, setTimer] = useState();

    const sync = fn => delay ? clearTimeout(timer) && setTimer(setTimeout(fn, timeout)) : fn();

    const safe = props.disabled ? () => {} : onChange;
    const change = {
      handleChange: e => e.persist() || sync(() => safe(e.target.value)),
      handleValueChange: values => sync(() => safe(values.value)),
      handleRawValueChange: values => sync(() => safe(values.formattedValue)),
      handleFloatValueChange: values => sync(() => safe(values.floatValue))
    };
    return /*#__PURE__*/React.createElement(WrappedComponent, _extends({}, props, {
      change: change
    }));
  };
};

export default withChange(({
  type,
  change,
  ...props
}) => {
  const {
    handleChange,
    handleValueChange,
    handleRawValueChange,
    handleFloatValueChange
  } = change;
  const commonProps = {
    onChange: handleChange,
    spellCheck: false,
    autoComplete: "on",
    type,
    ...props
  };
  const numberFormatProps = { ...commonProps,
    type,
    allowNegative: false,
    thousandSeparator: ".",
    decimalSeparator: ",",
    onValueChange: handleFloatValueChange,
    onChange: undefined
  };

  switch (type) {
    case "int":
      return /*#__PURE__*/React.createElement(NumberFormat, _extends({}, numberFormatProps, {
        decimalScale: 0,
        type: "tel"
      }));

    case "float":
      return /*#__PURE__*/React.createElement(NumberFormat, numberFormatProps);

    default:
      return /*#__PURE__*/React.createElement("input", commonProps);
  }
});