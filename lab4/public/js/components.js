"use strict";

var Recipe = React.createClass({
  displayName: "Recipe",

  getInitialState: function getInitialState() {
    return { showingDetails: false };
  },
  showMore: function showMore(e) {
    e.preventDefault();
    this.setState({ showingDetails: true });
  },
  showLess: function showLess(e) {
    e.preventDefault();
    this.setState({ showingDetails: false });
  },
  render: function render() {
    var bodyContent = undefined;
    var toggler = undefined;
    if (this.state.showingDetails) {
      var steps = this.props.steps.map(function (step) {
        return React.createElement(
          "li",
          null,
          step
        );
      });

      var ingredients = this.props.ingredients.map(function (step) {
        return React.createElement(
          "li",
          null,
          step
        );
      });

      bodyContent = React.createElement(
        "div",
        null,
        React.createElement(
          "p",
          null,
          this.props.description
        ),
        React.createElement(
          "div",
          { className: "row" },
          React.createElement(
            "div",
            { className: "col-md-8" },
            React.createElement(
              "ol",
              null,
              steps
            )
          ),
          React.createElement(
            "div",
            { className: "col-sm-4" },
            React.createElement(
              "ul",
              null,
              ingredients
            )
          )
        )
      );
      toggler = React.createElement(
        "p",
        { className: "text-center" },
        React.createElement(
          "a",
          { onClick: this.showLess, href: "" },
          "Show Less"
        )
      );
    } else {
      var words = this.props.description.split(' ');
      bodyContent = React.createElement(
        "p",
        null,
        words.slice(0, 35).join(" "),
        words.length > 35 ? '... ' : undefined,
        words.length > 35 ? React.createElement(
          "a",
          { onClick: this.showMore },
          "read on"
        ) : undefined
      );

      toggler = React.createElement(
        "p",
        { className: "text-center" },
        React.createElement(
          "a",
          { onClick: this.showMore, href: "" },
          "Show Details"
        )
      );
    }

    return React.createElement(
      "div",
      { className: "panel panel-default" },
      React.createElement(
        "div",
        { className: "panel-heading" },
        this.props.title
      ),
      React.createElement(
        "div",
        { className: "panel-body" },
        bodyContent,
        toggler
      )
    );
  }
});
"use strict";

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var RecipeForm = React.createClass({
    displayName: "RecipeForm",
    getInitialState: function getInitialState() {
        return { title: "", description: "", steps: [], ingredients: [], newIngredient: "", newStep: "" };
    },
    changeTitle: function changeTitle(e) {
        this.setState({ title: e.target.value });
    },
    changeDescription: function changeDescription(e) {
        this.setState({ description: e.target.value });
    },
    addIngredient: function addIngredient(e) {
        var ingredients = this.state.ingredients.concat([this.state.newIngredient]);

        this.setState({ ingredients: ingredients, newIngredient: "" });
    },
    addStep: function addStep(e) {
        var steps = this.state.steps.concat([this.state.newStep]);

        this.setState({ steps: steps, newStep: "" });
    },
    changeNewIngredientText: function changeNewIngredientText(e) {
        this.setState({ newIngredient: e.target.value });
        //this.enabled;
    },
    changeNewStepText: function changeNewStepText(e) {
        this.setState({ newStep: e.target.value });
    },
    clearForm: function clearForm() {
        this.state.title = "";
        this.state.description = "";
        this.state.steps = [];
        this.state.ingredients = [];
    },
    handleFormSubmit: function handleFormSubmit(e) {
        var _this = this;

        //console.log(e);
        e.preventDefault();

        var newRecipe = {
            title: this.state.title,
            description: this.state.description,
            steps: this.state.steps,
            ingredients: this.state.ingredients
        };

        if (newRecipe.steps.length > 0 && newRecipe.ingredients.length > 0) {
            //newRecipe = JSON.stringify(newRecipe);
            //this.props.onRecipeCreation(newRecipe);
            //this.getInitialState();
            for (var i = 0; i < this.props.myRecipes.length; i++) {
                if (this.props.myRecipes[i].title == newRecipe.title) {
                    alert("Duplicate title, enter a unique title");
                    return;
                }
            }
            $.ajax({
                url: this.props.newRecipeUrl,
                dataType: 'json',
                type: 'POST',
                data: { recipe: newRecipe },
                success: function success(data) {
                    //alert("succeed");
                    _this.props.onRecipeCreation(newRecipe);
                    _this.clearForm();
                },
                error: function error(xhr, status, err) {
                    alert("err");
                    console.error(_this.props.url, status, err.toString());
                }
            });
        } else {
            //console.log("RESPONSEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEE");
            alert("Enter at least 1 ingredient and at least 1 step");
            e.preventDefault();
        }

        //this.handleCLearForm(e);
    },
    render: function render() {
        var newTitleText = "New Recipe: " + (this.state.title || '') + " (" + this.state.ingredients.length + " ingredients, " + this.state.steps.length + " steps)";

        return React.createElement(
            "div",
            { className: "recipe" },
            React.createElement(
                "h3",
                null,
                "Add a New Recipe"
            ),
            React.createElement(
                "form",
                { onSubmit: this.handleFormSubmit, className: "myForm" },
                React.createElement(
                    "div",
                    { className: "form-horizontal" },
                    React.createElement(
                        "div",
                        { className: "form-group" },
                        React.createElement(
                            "label",
                            { htmlFor: "newTitle", className: "col-sm-3 control-label" },
                            "Title"
                        ),
                        React.createElement(
                            "div",
                            { className: "col-sm-9" },
                            React.createElement("input", {
                                className: "form-control",
                                id: "newTitle",
                                placeholder: "New Recipe",
                                onChange: this.changeTitle,
                                value: this.state.title,
                                type: "text", required: true })
                        )
                    ),
                    React.createElement(
                        "div",
                        { className: "form-group" },
                        React.createElement(
                            "label",
                            { htmlFor: "newDescription", className: "col-sm-3 control-label" },
                            "Description"
                        ),
                        React.createElement(
                            "div",
                            { className: "col-sm-9" },
                            React.createElement("textarea", {
                                className: "form-control",
                                id: "newDescription",
                                placeholder: "Recipe description",
                                onChange: this.changeDescription, required: true })
                        )
                    ),
                    React.createElement(
                        "div",
                        { className: "form-group" },
                        React.createElement(
                            "label",
                            { htmlFor: "newIngredientText", className: "col-sm-3 control-label" },
                            "New Ingredient"
                        ),
                        React.createElement(
                            "div",
                            { className: "col-sm-9" },
                            React.createElement(
                                "div",
                                { className: "input-group" },
                                React.createElement("input", _defineProperty({
                                    className: "form-control",
                                    type: "text",
                                    id: "newIngredientText",
                                    placeholder: "New Ingredient",
                                    value: this.state.newIngredient,
                                    onChange: this.changeNewIngredientText
                                }, "value", this.state.newIngredient)),
                                React.createElement(
                                    "span",
                                    { className: "input-group-btn" },
                                    React.createElement(
                                        "button",
                                        { className: "btn btn-primary", type: "button", onClick: this.addIngredient, disabled: !this.state.newIngredient },
                                        "Add Ingredient"
                                    )
                                )
                            )
                        )
                    ),
                    React.createElement(
                        "div",
                        { className: "form-group" },
                        React.createElement(
                            "label",
                            { htmlFor: "newStepText", className: "col-sm-3 control-label" },
                            "New Step"
                        ),
                        React.createElement(
                            "div",
                            { className: "col-sm-9" },
                            React.createElement(
                                "div",
                                { className: "input-group" },
                                React.createElement("input", _defineProperty({
                                    className: "form-control",
                                    type: "text",
                                    id: "newStepText",
                                    placeholder: "New Step Instructions",
                                    value: this.state.newStep,
                                    onChange: this.changeNewStepText
                                }, "value", this.state.newStep))
                            )
                        )
                    ),
                    React.createElement(
                        "div",
                        { className: "form-group" },
                        React.createElement(
                            "div",
                            { className: "col-sm-offset-3 col-sm-9" },
                            React.createElement(
                                "button",
                                { className: "btn btn-primary", type: "button", onClick: this.addStep, disabled: !this.state.newStep },
                                "Add Step"
                            )
                        )
                    ),
                    React.createElement(
                        "div",
                        { className: "form-group" },
                        React.createElement(
                            "div",
                            { className: "col-sm-12" },
                            React.createElement(
                                "button",
                                { type: "submit", className: "btn btn-default" },
                                "Add Recipe"
                            )
                        )
                    )
                )
            ),
            React.createElement(Recipe, {
                title: newTitleText,
                description: this.state.description,
                steps: this.state.steps,
                ingredients: this.state.ingredients })
        );
    }
});
"use strict";

var RecipeList = React.createClass({
    displayName: "RecipeList",

    getInitialState: function getInitialState() {
        return { recipes: [] };
    },
    componentDidMount: function componentDidMount() {
        var _this = this;

        var me = this.props.url;
        $.ajax({
            url: this.props.url,
            dataType: 'json',
            cache: false,
            success: function success(recipeList) {
                _this.setState({ recipes: recipeList });
            },
            error: function error(xhr, status, err) {
                console.error(_this.props.url, status, err.toString());
            }
        });
    },
    addNewRecipe: function addNewRecipe(newRecipe) {
        var recipes = this.state.recipes;
        var newRecipeList = recipes.concat([newRecipe]);
        this.setState({ recipes: newRecipeList });
        //this.getInitialState();
    },

    render: function render() {
        var recipeList = this.state.recipes;
        var recipes = recipeList.map(function (recipe) {
            return React.createElement(Recipe, {
                key: recipe.id,
                title: recipe.title,
                description: recipe.description,
                id: recipe.id,
                steps: recipe.steps,
                ingredients: recipe.ingredients });
        });

        return React.createElement(
            "div",
            { className: "recipe" },
            recipes,
            React.createElement("hr", null),
            React.createElement(RecipeForm, {
                newRecipeUrl: this.props.url,
                onRecipeCreation: this.addNewRecipe,
                myRecipes: this.state.recipes })
        );
    }
});

ReactDOM.render(React.createElement(RecipeList, { url: "/recipes" }), document.getElementById('content'));