import React, { useState } from "react";
import NumberFormat from "react-number-format";

const withChange = (WrappedComponent) => {
  return ({ delay, onChange, timeout = 200, ...props }) => {
    const [timer, setTimer] = useState();
    const sync = (fn) => delay ? clearTimeout(timer) && setTimer(setTimeout(fn, timeout)) : fn();
    const safe = props.disabled ? () => {} : onChange;
    const change = {
      handleChange: e => e.persist() || sync(() => safe(e.target.value)),
      handleValueChange: values => sync(() => safe(values.value)),
      handleRawValueChange: values => sync(() => safe(values.formattedValue)),
      handleFloatValueChange: values => sync(() => safe(values.floatValue))
    };
    return <WrappedComponent {...props} change={change} />;
  };
};


export default withChange(({ type, change, ...props }) => {
  const { handleChange, handleValueChange, handleRawValueChange, handleFloatValueChange } = change;
  const commonProps = {
    onChange: handleChange,
    spellCheck: false,
    autoComplete: "on",
    type,
    ...props,
  };
  const numberFormatProps = {
    ...commonProps,
    type,
    allowNegative: false,
    thousandSeparator: ".",
    decimalSeparator: ",",
    onValueChange: handleFloatValueChange,
    onChange: undefined,
  };
  switch (type) {
    case "int":
      return <NumberFormat {...numberFormatProps} decimalScale={0} type="tel" />;
    case "float":
      return <NumberFormat {...numberFormatProps} />;
    default:
      return <input {...commonProps} />;
  }
});
