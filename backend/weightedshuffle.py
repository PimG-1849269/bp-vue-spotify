import sys
import os 
import json
import mcdm

def getNormalisedBeneficiaryValue(feature, idealval, songval):
    idealval = float(idealval)
    songval = float(songval)

    if (feature == "key"):
        # If key unknown, act as if good
        val = songval
        if (val == -1):
            val = idealval

        diff_to_val = abs(idealval - val)
        max_diff = 11

    elif (feature == "loudness"):
        # Cap on loudness, Spotify API: "Values typically range between -60 and 0 db."
        val = songval
        if (val < -60):
            val = -60
        if (val > 0):
            val = 0

        diff_to_val = abs(idealval - val)
        max_diff = 60

    elif (feature == "mode"):
        # Mode is boolean, so it's either the same, or different
        diff_to_val = abs(idealval - songval)
        max_diff = 1

    elif (feature == "tempo"):
        # Cap on tempo (bpm)
        val = songval
        if (val < 20):
            val = 20
        if (val > 250):
            val = 250

        diff_to_val = abs(idealval - val)
        max_diff = 230

    elif (feature == "time_signature"):
        # Value lies between 3 and 7
        diff_to_val = abs(idealval - songval)
        max_diff = 4
        
    elif (feature == "duration_ms"):
        # Cap on duration on 10min.
        val = songval
        if (val < 0):
            val = 0
        if (val > 600000):
            val = 600000

        diff_to_val = abs(idealval - val)
        max_diff = 600000

    # Procentual value
    else:
        val = songval * 100
        diff_to_val = abs(idealval - val)
        max_diff = 100
    
    # Return right value
    # "1-" to make the value BENEFICIARY, divide to make NORMALISED 
    return (1 - (diff_to_val / max_diff))

def main():
    ### Get the features that need to be used
    shufflefeat = json.loads(sys.argv[1])
    # shufflefeat = {
    #     "energy": 0.851, 
    #     "speechiness": 0.0364, 
    #     "liveness": 0.107,
    #     "loudness": -5.307,
    #     "duration_ms": 292133,
    #     "time_signature": 4,
    #     "mode": 1,
    #     "key": 0
    # }
    chosen_feat = shufflefeat.keys()

    ### Get all features of all songs
    dir_path = os.path.dirname(os.path.realpath(__file__))
    file = open(dir_path+"/features.json")
    features = json.load(file)
    feat_array = features["audio_features"]

    ### Define order based on weighted sorting
    # Define matrix
    matrix = []
    for song in feat_array:
        row = []
        for feat in chosen_feat:
            row.append(getNormalisedBeneficiaryValue(feat, shufflefeat[feat], song[feat]))
        matrix.append(row)

    # Rank
    # individual featureimportance: w_vector=[0.7, 0.3] for example for 2 features
    ordervalues = mcdm.rank(matrix, alt_names=range(len(feat_array)), s_method="mTOPSIS")
    
    order = []
    for o in ordervalues:
        order.append(o[0])

    ### Return new order
    # Sending json in json does not work,
    # solution: https://stackoverflow.com/questions/50787082/sending-json-from-python-to-node-via-child-process-gets-truncated-if-too-long-h
    print(order)
    sys.stdout.flush()




if __name__ == "__main__":
    main()