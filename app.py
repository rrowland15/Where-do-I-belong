from flask import Flask, jsonify, render_template, request
import pandas as pd
import numpy as np


app = Flask(__name__)


# Read in sample data
df_redfin = pd.read_csv("static/redfin_merged_data.csv")
unique_FIPS = pd.DataFrame(pd.unique(df_redfin["fips"]), columns=["fips"])
score_df = pd.read_csv('static/scores_combined.csv')

#Create random numbers for column
unique_FIPS["well_being"] = np.random.uniform(0,5, size=len(unique_FIPS))
unique_FIPS["fips"] = unique_FIPS["fips"].astype("str").apply(lambda x: x.zfill(5))

# FIPS test data as JSON string
json_FIPS = unique_FIPS.to_json(orient="split")


@app.route('/')
def index():
    return render_template('index.html')


@app.route('/input', methods=['POST'])
def input():
    ''''This is where all the POST data is being collected from the drop downs and text field'''
    init_features = [x for x in request.form.values()]

    

    
    percentile_dict = {"1":0.7,"2":0.75,"3":0.8,"4":0.85,"5":0.9}
    print(request.form)
    qhealth = percentile_dict[request.form["Health"]]
    shealth = score_df['HEA_HC_Score'].quantile(qhealth)
    print(shealth)

    
    # You can print to terminal here to test what you put into inputs at top of page
    #print("This is example of user input for options and house pricing")
    #print(init_features)

    # Place Clustering Algo Here!!

    return render_template('index.html', new_data=init_features)

@app.route('/test_data')
def test_data():

    return json_FIPS


if __name__ == '__main__':
    app.run(debug=True, port =5000)
