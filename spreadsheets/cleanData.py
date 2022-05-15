from csv import QUOTE_NONNUMERIC
import pandas as pd

  
def idFromName(row, df):
  return df[df['name'] == row].index.values[0]

def idFromId(row,df, column, val):
  return  df[df[column] == row.name][val].iat[0]

def incrementIndex(df):
  df.index += 1
  df.index.name = 'name'

org = pd.read_excel('spreadsheets/organizacija.xlsx', sheet_name='Opštine u Srbiji', names=['region', 'okrug', 'opstina'], usecols=[0, 1, 2])

persons = pd.read_excel('spreadsheets/spisak.xlsx', sheet_name='Spisak').drop(['Spojnica', 'Godina', 'Mesto'], axis=1)
persons.columns = 'pol,srpsko_prezime,srpsko_ime,srpski_nadimak,prezime,ime,srednje_slovo,nadimak,rodjenje,smrt,groblje,opstina,okrug,region'.split(',')
persons = persons.replace('x', None)
persons = persons.replace('1300 kaplara (van groblja)', '1300 kaplara')

groblja = pd.DataFrame(persons['groblje'].unique(), columns=['name'] )
opstine = pd.DataFrame(org['opstina'].unique(), columns=['name'] )
okruzi = pd.DataFrame(org['okrug'].unique(), columns=['name'] )
regioni = pd.DataFrame(org['region'].unique(), columns=['name'])

incrementIndex(persons)
incrementIndex(groblja)
incrementIndex(opstine)
incrementIndex(okruzi)
incrementIndex(regioni)

persons['groblje'] = persons['groblje'].apply(idFromName, args=(groblja,))
persons['opstina'] = persons['opstina'].apply(idFromName, args=(opstine,))
persons['okrug'] = persons['okrug'].apply(idFromName, args=(okruzi,))
persons['region'] = persons['region'].apply(idFromName, args=(regioni,))

org['region_id'] = org['region'].apply(idFromName, args=(regioni, ))
org['okrug_id'] = org['okrug'].apply(idFromName, args=(okruzi, ))
org['opstina_id'] = org['opstina'].apply(idFromName, args=(opstine, ))

groblja['opstina_id'] = groblja.apply(idFromId, args=(persons, 'groblje','opstina',), axis=1)
opstine['okrug_id'] = opstine.apply(idFromId, args=(org,'opstina_id','okrug_id',), axis=1)
okruzi['region_id'] = okruzi.apply(idFromId, args=(org,'okrug_id', 'region_id',), axis=1)


persons.to_csv('spreadsheets/persons.csv', index_label='id', quoting=QUOTE_NONNUMERIC)
groblja.to_csv('spreadsheets/groblja.csv', index_label='id', quoting=QUOTE_NONNUMERIC)
opstine.to_csv('spreadsheets/opstine.csv', index_label='id', quoting=QUOTE_NONNUMERIC)
regioni.to_csv('spreadsheets/regioni.csv', index_label='id', quoting=QUOTE_NONNUMERIC)
okruzi.to_csv('spreadsheets/okruzi.csv', index_label='id', quoting=QUOTE_NONNUMERIC)