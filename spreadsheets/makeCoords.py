import pandas as pd 

df = pd.read_excel('spreadsheets/koordinate.xlsx')
for row in df.itertuples():
  if row[5] > 0:
    print(row[4])
    print('{"lat":' + str(row[5]) + ', "lng":' + str(row[6]) + '}')
 
