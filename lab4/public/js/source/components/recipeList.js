const RecipeList = React.createClass({
    getInitialState: function () {
        return {recipes: []};
    },
    componentDidMount: function () {
        var me = this.props.url;
        $.ajax({
            url: this.props.url,
            dataType: 'json',
            cache: false,
            success: (recipeList) => {
                this.setState({recipes: recipeList});
            },
            error: (xhr, status, err) => {
                console.error(this.props.url, status, err.toString());
            }
        });
    },
    addNewRecipe(newRecipe) {
        let recipes = this.state.recipes;
        let newRecipeList = recipes.concat([newRecipe]);
        this.setState({recipes: newRecipeList});
        //this.getInitialState();
    },
    render: function () {
        let recipeList = this.state.recipes;
        let recipes = recipeList.map((recipe) => {
            return (
                <Recipe
                    key={recipe.id}
                    title={recipe.title}
                    description={recipe.description}
                    id={recipe.id}
                    steps={recipe.steps}
                    ingredients={recipe.ingredients} />
            );
        });

        return (
            <div className="recipe">
                {recipes}
                <hr />
                <RecipeForm
                 newRecipeUrl={this.props.url}
                 onRecipeCreation={this.addNewRecipe}
                 myRecipes={this.state.recipes}/>
            </div>
        );
    }
});

ReactDOM.render(
    <RecipeList url="/recipes"/>, document.getElementById('content'));