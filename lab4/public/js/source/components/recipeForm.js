const RecipeForm = React.createClass({
    getInitialState() {
        return { title: "", description: "", steps: [], ingredients: [], newIngredient: "", newStep: "" };
    },
    changeTitle(e) {
        this.setState({ title: e.target.value });
    },
    changeDescription(e) {
        this.setState({ description: e.target.value });
    },
    addIngredient(e) {
        let ingredients = this
            .state
            .ingredients
            .concat([this.state.newIngredient]);

        this.setState({ ingredients: ingredients, newIngredient: "" });
    },
    addStep(e) {
        let steps = this
            .state
            .steps
            .concat([this.state.newStep]);

        this.setState({steps: steps, newStep: ""});
    },
    changeNewIngredientText(e) {
        this.setState({ newIngredient: e.target.value });
        //this.enabled;
    },
    changeNewStepText(e) {
        this.setState({newStep: e.target.value});
    },
    clearForm()
    {
        this.state.title = "";
        this.state.description = "";
        this.state.steps = [];
        this.state.ingredients = [];
    },
    handleFormSubmit(e) {
        
        //console.log(e);
        e.preventDefault();
        
       
        var newRecipe = {
            title: this.state.title,
            description: this.state.description,
            steps: this.state.steps,
            ingredients: this.state.ingredients
        };

        
        if(newRecipe.steps.length > 0 && newRecipe.ingredients.length > 0)
        {
            //newRecipe = JSON.stringify(newRecipe);
            //this.props.onRecipeCreation(newRecipe);
            //this.getInitialState();
            for(var i = 0; i < this.props.myRecipes.length; i++)
            {
                if(this.props.myRecipes[i].title == newRecipe.title)
                {
                    alert("Duplicate title, enter a unique title");
                    return;
                }
            }
            $.ajax({
            url: this.props.newRecipeUrl,
            dataType: 'json',
            type: 'POST',
            data: {recipe: newRecipe},
            success: (data) => {
                //alert("succeed");
                this.props.onRecipeCreation(newRecipe);
                this.clearForm();
            },
            error: (xhr, status, err) => {
                alert("err");
                console.error(this.props.url, status, err.toString());
            }
        });
        }
        else
        {
            //console.log("RESPONSEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEE");
            alert("Enter at least 1 ingredient and at least 1 step");
            e.preventDefault();
        }

        //this.handleCLearForm(e);
    },
    render() {
        let newTitleText = `New Recipe: ${this.state.title || ''} (${this.state.ingredients.length} ingredients, ${this.state.steps.length} steps)`;

        return (
            <div className="recipe">
                <h3>Add a New Recipe</h3>
                <form onSubmit={this.handleFormSubmit} className="myForm">
                <div className="form-horizontal">
                    <div className="form-group">
                        <label htmlFor="newTitle" className="col-sm-3 control-label">Title</label>
                        <div className="col-sm-9">
                            <input
                                className="form-control"
                                id="newTitle"
                                placeholder="New Recipe"
                                onChange={this.changeTitle}
                                value={this.state.title}
                                type="text" required />
                        </div>
                    </div>
                    <div className="form-group">
                        <label htmlFor="newDescription" className="col-sm-3 control-label">Description</label>
                        <div className="col-sm-9">
                            <textarea
                                className="form-control"
                                id="newDescription"
                                placeholder="Recipe description"
                                onChange={this.changeDescription} required></textarea>
                        </div>
                    </div>
                    <div className="form-group">
                        <label htmlFor="newIngredientText" className="col-sm-3 control-label">New Ingredient</label>
                        <div className="col-sm-9">
                            <div className="input-group">
                                <input
                                    className="form-control"
                                    type="text"
                                    id="newIngredientText"
                                    placeholder="New Ingredient"
                                    value={this.state.newIngredient}
                                    onChange={this.changeNewIngredientText} 
                                    value={this.state.newIngredient}/>
                                <span className="input-group-btn">
                                    <button className="btn btn-primary" type="button" onClick={this.addIngredient} disabled={!this.state.newIngredient} >Add Ingredient</button>
                                </span>
                            </div>
                        </div>
                    </div>
                    <div className="form-group">
                        <label htmlFor="newStepText" className="col-sm-3 control-label">New Step</label>
                        <div className="col-sm-9">
                        <div className="input-group">
                            <input
                                className="form-control"
                                type="text"
                                id="newStepText"
                                placeholder="New Step Instructions"
                                value={this.state.newStep}
                                onChange={this.changeNewStepText}
                                value={this.state.newStep}/>
                            </div>
                        </div>
                    </div>
                    <div className="form-group">
                        <div className="col-sm-offset-3 col-sm-9">
                            <button className="btn btn-primary" type="button" onClick={this.addStep} disabled={!this.state.newStep}>Add Step</button>
                        </div>
                    </div>
                    <div className="form-group">
                        <div className="col-sm-12">
                            <button type="submit" className="btn btn-default">Add Recipe</button>
                        </div>
                    </div>
                </div>
                </form>
                <Recipe
                    title={newTitleText}
                    description={this.state.description}
                    steps={this.state.steps}
                    ingredients={this.state.ingredients} />
            </div>
        );
    }
});
