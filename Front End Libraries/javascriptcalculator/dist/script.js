const digitLimit = 21;
const limitMessage = "Digit Limit Reached!";

const operatorsExp = /[+x\/-]$/;

class Formula extends React.Component {

  constructor(props) {
    super(props);
  }

  render() {
    return (
      React.createElement("div", { className: "formula-screen" }, this.props.formula));

  }}


class Output extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      React.createElement("div", { id: "display", className: "output-screen" }, this.props.output));

  }}


class Buttons extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      React.createElement("div", { id: "buttons-container" },
      React.createElement("button", { className: "all-clear", id: "clear", value: "AC", onClick: this.props.handleClear }, "AC"),
      React.createElement("button", { className: "operators", id: "divide", value: "/", onClick: this.props.handleOperators }, "/"),
      React.createElement("button", { className: "operators", id: "multiply", value: "x", onClick: this.props.handleOperators }, "x"),

      React.createElement("button", { className: "digits", id: "seven", value: "7", onClick: this.props.handleNumbers }, "7"),
      React.createElement("button", { className: "digits", id: "eight", value: "8", onClick: this.props.handleNumbers }, "8"),
      React.createElement("button", { className: "digits", id: "nine", value: "9", onClick: this.props.handleNumbers }, "9"),

      React.createElement("button", { className: "operators", id: "subtract", value: "-", onClick: this.props.handleOperators }, "-"),

      React.createElement("button", { className: "digits", id: "four", value: "4", onClick: this.props.handleNumbers }, "4"),
      React.createElement("button", { className: "digits", id: "five", value: "5", onClick: this.props.handleNumbers }, "5"),
      React.createElement("button", { className: "digits", id: "six", value: "6", onClick: this.props.handleNumbers }, "6"),

      React.createElement("button", { className: "operators", id: "add", value: "+", onClick: this.props.handleOperators }, "+"),

      React.createElement("button", { className: "digits", id: "one", value: "1", onClick: this.props.handleNumbers }, "1"),
      React.createElement("button", { className: "digits", id: "two", value: "2", onClick: this.props.handleNumbers }, "2"),
      React.createElement("button", { className: "digits", id: "three", value: "3", onClick: this.props.handleNumbers }, "3"),

      React.createElement("button", { className: "calculation", id: "equals", value: "=", onClick: this.props.handleEvaluate }, "="),
      React.createElement("button", { className: "digits", id: "zero", value: "0", onClick: this.props.handleNumbers }, "0"),
      React.createElement("button", { className: "decimal", id: "decimal", value: ".", onClick: this.props.handleDecimal }, ".")));



  }}


class Calculator extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      output: "0",
      prevOutput: "0",
      formula: "",
      isEvaluated: false };


    this.handleNumbers = this.handleNumbers.bind(this);
    this.handleOperators = this.handleOperators.bind(this);
    this.handleDecimal = this.handleDecimal.bind(this);
    this.handleClear = this.handleClear.bind(this);
    this.handleEvaluate = this.handleEvaluate.bind(this);
    this.diplayWarning = this.displayWarning.bind(this);
    this.initialize = this.initialize.bind(this);
  }

  handleNumbers(e) {
    if (this.state.output == limitMessage ||
    this.state.output == 0 && e.target.value == 0) {
      return;
    }

    if (this.state.output == "0" || operatorsExp.test(this.state.output)) {
      this.setState({
        isEvaluated: false,
        output: e.target.value,
        formula: this.state.formula.concat(e.target.value),
        prevOutput: e.target.value });


    } else if (this.state.isEvaluated) {
      this.setState({
        isEvaluated: false,
        output: e.target.value,
        formula: e.target.value,
        prevOutput: e.target.value });

    } else {
      if (this.state.output.length >= digitLimit) {
        this.displayWarning();
      } else {
        console.log("out, val: ", this.state.output, e.target.value);
        this.setState({
          output: this.state.output.concat(e.target.value),
          formula: this.state.formula.concat(e.target.value),
          prevOutput: this.state.output.concat(e.target.value) });

      }
    }
  }

  handleOperators(e) {
    if (this.state.output == limitMessage ||
    this.state.formula == "" && e.target.value.search(/x|\//g) != -1) {
      return;
    }

    if (this.state.isEvaluated) {
      this.setState({
        formula: this.state.output.toString().concat(e.target.value),
        output: e.target.value,
        isEvaluated: false,
        prevOutput: "0" });

    } else if (operatorsExp.test(this.state.formula) || this.state.formula.endsWith(".")) {
      this.setState({
        formula: this.state.formula.slice(0, -1).concat(e.target.value),
        output: e.target.value });

    } else {
      this.setState({
        formula: this.state.formula.concat(e.target.value),
        output: e.target.value });

    }
  }

  handleClear(e) {
    this.initialize();
  }

  handleDecimal(e) {
    if (this.state.output == limitMessage) {
      return;
    }

    if (!(this.state.output.indexOf(".") != -1)) {
      if (this.state.output == "0" || operatorsExp.test(this.state.output)) {
        this.setState({
          output: "0.",
          formula: this.state.formula.endsWith("0") ?
          this.state.formula.concat(".") : this.state.formula.concat("0.") });

      } else {
        this.setState({
          output: this.state.output.concat(e.target.value),
          formula: this.state.formula.concat(e.target.value) });

      }
    }
  }

  handleEvaluate(e) {
    if (this.state.output != limitMessage) {
      let expression = this.state.formula;
      if (operatorsExp.test(expression) || expression.endsWith(".")) {
        expression = expression.slice(0, -1);
      }

      expression = expression.replace(/x/g, "*");

      let result = eval(expression);
      if (result != undefined) {
        this.setState({
          output: result,
          formula: this.state.formula.concat("=" + result),
          isEvaluated: true });

      }
    }
  }

  initialize() {
    this.setState({
      output: "0",
      formula: "",
      prevOutput: "0",
      isEvaluated: false });

  }

  displayWarning() {
    this.setState({
      output: limitMessage });


    setTimeout(
    () => this.setState({
      output: this.state.prevOutput }),

    1000);

  }

  render() {
    return (
      React.createElement("div", { className: "calculator" },
      React.createElement(Formula, { formula: this.state.formula }),
      React.createElement(Output, { output: this.state.output }),
      React.createElement(Buttons, {
        handleNumbers: this.handleNumbers,
        handleOperators: this.handleOperators,
        handleDecimal: this.handleDecimal,
        handleClear: this.handleClear,
        handleEvaluate: this.handleEvaluate })));


  }}


ReactDOM.render(React.createElement(Calculator, null), document.getElementById("app"));