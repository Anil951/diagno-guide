from flask import Flask, render_template, request,jsonify
import json
import joblib
from joblib import dump , load
from flask import Flask, request
import pandas as pd
from sklearn.neighbors import NearestNeighbors
import json
import math
import Levenshtein #for getting nearest disease name from the disease names whihc are in dataset
import requests #for medication for symptoms


app = Flask(__name__)


global response
global symptoms
global symsmapping

precaution_df = pd.read_csv('models/disease_precaution.csv')
hospital_data = pd.read_csv("models/Hospital_Directory.csv")
med=pd.read_csv("models/rec-med.csv")
doctype=pd.read_csv("models/Doctor_Versus_Disease.csv",encoding='ISO-8859-1')




response=dict()
response1=dict()

@app.route('/')
def home():
    

    return render_template('index.html')


all_symptoms = ['itching', 'skin_rash', 'nodal_skin_eruptions',
       'dischromic _patches', 'continuous_sneezing', 'shivering',
       'chills', 'watering_from_eyes', 'stomach_pain', 'acidity',
       'ulcers_on_tongue', 'vomiting', 'cough', 'chest_pain',
       'yellowish_skin', 'nausea', 'loss_of_appetite', 'abdominal_pain',
       'yellowing_of_eyes', 'burning_micturition', 'spotting_ urination',
       'passage_of_gases', 'internal_itching', 'indigestion',
       'muscle_wasting', 'patches_in_throat', 'high_fever',
       'extra_marital_contacts', 'fatigue', 'weight_loss', 'restlessness',
       'lethargy', 'irregular_sugar_level',
       'blurred_and_distorted_vision', 'obesity', 'excessive_hunger',
       'increased_appetite', 'polyuria', 'sunken_eyes', 'dehydration',
       'diarrhoea', 'breathlessness', 'family_history', 'mucoid_sputum',
       'headache', 'dizziness', 'loss_of_balance',
       'lack_of_concentration', 'stiff_neck', 'depression',
       'irritability', 'visual_disturbances', 'back_pain',
       'weakness_in_limbs', 'neck_pain', 'weakness_of_one_body_side',
       'altered_sensorium', 'dark_urine', 'sweating', 'muscle_pain',
       'mild_fever', 'swelled_lymph_nodes', 'malaise',
       'red_spots_over_body', 'joint_pain', 'pain_behind_the_eyes',
       'constipation', 'toxic_look_(typhos)', 'belly_pain',
       'yellow_urine', 'receiving_blood_transfusion',
       'receiving_unsterile_injections', 'coma', 'stomach_bleeding',
       'acute_liver_failure', 'swelling_of_stomach',
       'distention_of_abdomen', 'history_of_alcohol_consumption',
       'fluid_overload', 'phlegm', 'blood_in_sputum', 'throat_irritation',
       'redness_of_eyes', 'sinus_pressure', 'runny_nose', 'congestion',
       'loss_of_smell', 'fast_heart_rate', 'rusty_sputum',
       'pain_during_bowel_movements', 'pain_in_anal_region',
       'bloody_stool', 'irritation_in_anus', 'cramps', 'bruising',
       'swollen_legs', 'swollen_blood_vessels', 'prominent_veins_on_calf',
       'weight_gain', 'cold_hands_and_feets', 'mood_swings',
       'puffy_face_and_eyes', 'enlarged_thyroid', 'brittle_nails',
       'swollen_extremeties', 'abnormal_menstruation', 'muscle_weakness',
       'anxiety', 'slurred_speech', 'palpitations',
       'drying_and_tingling_lips', 'knee_pain', 'hip_joint_pain',
       'swelling_joints', 'painful_walking', 'movement_stiffness',
       'spinning_movements', 'unsteadiness', 'pus_filled_pimples',
       'blackheads', 'scurring', 'bladder_discomfort',
       'foul_smell_of urine', 'continuous_feel_of_urine', 'skin_peeling',
       'silver_like_dusting', 'small_dents_in_nails',
       'inflammatory_nails', 'blister', 'red_sore_around_nose',
       'yellow_crust_ooze']



# response1=dict()
response2 = []

@app.route('/send_data', methods=['POST'])
def send_data():
    # Retrieve the data from the AJAX request
    global symptoms 
    symptoms = request.get_json()
    print("symptoms",symptoms)

    symsmapping = create_symptom_mapping(symptoms, all_symptoms)
    
    rfmodel = joblib.load("models/pred-dis.joblib")
    
    probabilities = rfmodel.predict_proba([symsmapping])
    disease_probabilities = dict(zip(rfmodel.classes_, probabilities[0]))

    top_n = 5
    sorted_probabilities = sorted(disease_probabilities.items(), key=lambda x: x[1], reverse=True)[:top_n]
    
    # Prepare the response data
    response2.clear()
    for disease, probability in sorted_probabilities:
        if probability > 0:
            predicted_disease_precautions = precaution_df[precaution_df['Disease'] == disease]
            prec = []
            if not predicted_disease_precautions.empty:
                for column in ['Symptom_precaution_0', 'Symptom_precaution_1', 'Symptom_precaution_2', 'Symptom_precaution_3']:
                    precaution_value = predicted_disease_precautions[column].values[0]
                    # Convert 'NaN' values to 'None'
                    precaution_value = None if isinstance(precaution_value, float) and math.isnan(precaution_value) else precaution_value
                    prec.append(precaution_value)

            result = doctype.loc[doctype['Disease'] == disease, 'Doctor']
            print("---in send_data()---",result.values[0])
            doc_type=result.values[0]

            disease_details = {
                'disease': disease,
                'probability': int(probability * 100),
                'precautions': prec,
                'doc_type':doc_type
            }
            
            response2.append(disease_details)

    print(response2)
    
    # Convert response2 to JSON and send it to the client
    return jsonify(response2)





@app.route('/update', methods=['POST'])
def update():
    
    print('pppppppppppppppppp')
    # name = request.form['name']
    name = request.form.get('name')

    # age = request.form['age']
    age = request.form.get('age')
    weight=request.form.get('weight')
    height=request.form.get('height')
    gender = request.form.get('gender')


    alcohol = request.form.get('alcohol', ['X','N'])
    # cigar = request.form.get('cigar', 'no')
    # preg = request.form.get('pregyesno', 'no')
    trisemister = request.form.get('trisemister', ['A','B','C','D','N','X'])
    
   

    predtxt=[name,age,weight,height,gender,alcohol,trisemister]
    print(predtxt)
    # syms = request.form.get('syms')

    # Process the data and generate the updated content
    response.update({'name': name, 'age': age,'weight':weight,'height':height,'gender':gender,'alcohol':alcohol,'trisemister':trisemister})

    
    
 
    print("______")
    print(response)

    return jsonify(response)



@app.route('/locate', methods=['POST'])
def locate():
    response1.clear()
    print("vroooooo")
    option = request.form.get('locationOption')
    print(option)
    if(option=="writtenLocation"):
        userloc = request.form.get('locationInput')
        t=getlatlong(userloc)
        latitude=t[0]
        longitude=t[1]
    else:
        latitude, longitude = get_live_location()

    print(latitude,longitude)
    hospitalcount = int(request.form.get('hospitalRange',3))


    response1.update({'latitude': latitude, 'longitude': longitude,'hospitalcount':hospitalcount})


    X = hospital_data[['lat', 'lon']].values
    global nbrs
    nbrs = NearestNeighbors(n_neighbors=hospitalcount, algorithm='ball_tree').fit(X)
    nearest_hospitals = []
    #giving user lat-long to ml model
    nearest_hospitals = suggest_nearest_hospitals(latitude, longitude)

    print(nearest_hospitals)
    print("_____________________________________________________________")
    # Print the results if there are nearest hospitals
    if nearest_hospitals:
        print("Nearest Hospitals:")
        for c, hospital in enumerate(nearest_hospitals):
            # print(f"{hospital[0]} - Distance: {hospital[1]} km - (lat: {hospital[2]}, long: {hospital[3]})")
            response1.update({
                f'hospital{c}': hospital[0],
                f'distance{c}': hospital[1],
                f'lat{c}': hospital[2],
                f'long{c}': hospital[3]
            })

    

    
    print(response1)

    return jsonify(response1)





@app.route('/medic', methods=['POST','GET'])
def medic():

    print("medic func")
    print(response2)

    return jsonify(response2)


response3=dict()
@app.route('/displaymedic', methods=['POST','GET'])
def displaymedic():
    response3.clear()
    global symptoms
    syms = [input_string.replace('_', ' ') for input_string in symptoms]
    print(syms)
    
    disease = request.form['disease']
    print(disease)
    probability=int(request.form['probability'])
    age = int(response['age'])
    pregnancy_condition = response['trisemister']
    alcohol=response['alcohol']
    gender=response['gender']

    
    result = doctype.loc[doctype['Disease'] == disease, 'Doctor']
    print(result.values[0])
    doc_type=result.values[0]

    if age > 50:
        response3.update({"gotohospital": "urgent"})
    else:
        if(int(request.form['probability'])<50):
            print(response2)
            medications = get_medication_info(syms)
            response3.update({"gotohospital": "for conformation","medications": medications})
            
        else:   
            medications = recmedicine(disease, age, gender, pregnancy_condition, alcohol)
            if(len(medications)!=0):
                response3.update({"medications": medications})
            else:
                medications1 = get_medication_info([disease])
                response3.update(medications1)

    response3.update({"disease": disease,"probability":probability,"doc_type":doc_type})
    print(response3)
    return jsonify(response3)



def get_medication_info(disease_list): #get medication using API
    medications_dict = {}

    base_url = "https://api.fda.gov/drug/label.json"

    for disease in disease_list:
        # Specify the query parameters for the API call
        params = {
            "search": f"indications_and_usage:{disease}",
            "limit": 5
        }

        try:
            # Send a GET request to the API endpoint
            response = requests.get(base_url, params=params)

            # Check if the request was successful (status code 200)
            if response.status_code == 200:
                # Parse the JSON response
                data = response.json()

                # Extract relevant information from the response
                medication_list = []
                for result in data['results']:
                    medication_name = result['openfda'].get('brand_name', None)
                    if medication_name and 'N/A' not in medication_name:  # Exclude 'N/A' values
                        medication_list.append(medication_name[0])

                medications_dict[disease] = medication_list
            else:
                 print("error")
                 medications_dict[disease] = ["404-ERROR: connect to internet"]

        except requests.exceptions.RequestException as e:
            print("error 1")
            medications_dict[disease] = ["404-ERROR: connect to internet"]
    print("api func",medications_dict)
    return medications_dict




conditions = ['Acne', 'ADHD', 'AIDS/HIV', 'Allergies', "Alzheimer's", 'Angina', 'Anxiety', 'Asthma', 'Bipolar Disorder', 'Bronchitis', 'Cancer', 'Cholesterol', 'Colds & Flu', 'Constipation', 'COPD', 'Depression', 'Diabetes (Type 1)', 'Diabetes (Type 2)', 'Diarrhea', 'Eczema', 'Erectile Dysfunction', 'Gastrointestinal', 'GERD (Heartburn)', 'Gout', 'Hair Loss', 'Hayfever', 'Herpes', 'Hypertension', 'Hypothyroidism', 'IBD (Bowel)', 'Incontinence', 'Insomnia', 'Menopause', 'Migraine', 'Osteoarthritis', 'Osteoporosis', 'Pain', 'Pneumonia', 'Psoriasis', 'Rheumatoid Arthritis', 'Schizophrenia', 'Seizures', 'Stroke', 'Swine Flu', 'UTI', 'Weight Loss', 'Jaundice', 'Urinary tract infection', 'Hepatitis A', 'Malaria', 'Peptic ulcer', 'Hypoglycemia', 'Hepatitis C', 'Varicose veins', 'Impetigo', 'Vertigo', 'Fungal Infections', 'Hepatitis B', 'Hemorrhoids', 'Myocardial infarction', 'Common Cold']

def find_nearest_condition(input_text, conditions_list):
    input_text = input_text.lower()
    best_match = None
    best_similarity = 0

    for condition in conditions_list:
        similarity = Levenshtein.ratio(input_text, condition.lower())
        if similarity > best_similarity:
            best_similarity = similarity
            best_match = condition

    return best_match




def recmedicine(disease,age,gender,pregnancy_condition,alcohol):
    print("rec medic dataset filter method")
    print(disease,age,gender,pregnancy_condition,alcohol)
    
    disease= find_nearest_condition(disease, conditions)
    # Filter the DataFrame based on the disease
    filtered_df = med[med['medical_condition'] == disease]
   

    if pregnancy_condition is not None:
        # Filter the DataFrame based on the allowed pregnancy categories
        filtered_df = filtered_df[filtered_df['pregnancy_category'].isin([pregnancy_condition])]
    
    if alcohol is not None:
        # Filter the DataFrame based on alcohol interaction
        filtered_df = filtered_df[filtered_df['alcohol'].isin([alcohol])]
        
    if int(age) < 10:
        # Filter dataset for users under 10 with at least 5 activity values
        filtered_df = filtered_df.nsmallest(5, 'activity')
        
    elif 10 <= int(age) <= 15:
        # Filter dataset for users between 10 and 15 with at least 10 activity values
        filtered_df = filtered_df.nsmallest(10, 'activity')
    
    
    # Get the "drug_name" column from the filtered DataFrame
    drug_names = filtered_df.head(5)['drug_name'].tolist()
    print(drug_names)
    return drug_names




def create_symptom_mapping(symptoms_list, symptom_names):
    symptom_mapping = [1 if symptom in symptoms_list else 0 for symptom in symptom_names]
    return symptom_mapping


def suggest_nearest_hospitals(user_latitude, user_longitude):

    # Find the indices of the nearest hospitals based on the user's location
    distances, indices = nbrs.kneighbors([[user_latitude, user_longitude]])
    
    nearest_hospitals = []
    for index in indices[0]:
        hospital_name = hospital_data.loc[index, "health_facility_name"]
        hospital_latitude = hospital_data.loc[index, "lat"]
        hospital_longitude = hospital_data.loc[index, "lon"]
        hospital_distance = calculate_road_distance(user_latitude,user_longitude, hospital_latitude, hospital_longitude)
        nearest_hospitals.append((hospital_name, hospital_distance, hospital_latitude, hospital_longitude))
    
    return nearest_hospitals


    
#calculate road distance between two locations

from geopy.distance import geodesic

def calculate_road_distance(lat1, lon1, lat2, lon2):
    # Coordinates of the two locations
    location1 = (lat1, lon1)
    location2 = (lat2, lon2)
    
    # Calculate the road distance between the two locations using geodesic distance
    distance = geodesic(location1, location2).kilometers
    
    return distance

#get lat long using location name

from geopy.geocoders import Nominatim
def getlatlong(location_str):
    # Create a Nominatim geocoder object
    geolocator = Nominatim(user_agent="http")

    # Use geocoder to convert location string to latitude and longitude
    location = geolocator.geocode(location_str)


    if location is not None:
        latitude = location.latitude
        longitude = location.longitude
        latitude=float(latitude)
        longitude=float(longitude)
    else:
        latitude,longitude=None,None
        
    return latitude,longitude

#get users current location

import geocoder

def get_live_location():
    g = geocoder.ip('me')
    return g.latlng



if __name__ == '__main__':
    app.run(debug=True)
