# Digivaate testiversio
Tämä on Metropolia Ammattikorkeakoulun kehittämä, DigiVaate-hankkeeseen liittyvä, selain-pohjainen sovellus, jota on hankkeessa käytetty tuotetietohallintaan ja digitaalista mallintamista varten.

Kyseessä on valmisvaatteita suunnittelevien, valmistavien ja tuottavien yritysten budjetoinnin ja valikoimanhallinnan tarpeisiin kehitetty tuotehallintasovellus, joka on yhdistettävissä yleisiin toimitusketjunhallintaohjelmiin. DigiVaate-konsepti on suunniteltu toimimaan yritysten muiden järjestelmien kanssa. Yleisesti käytössä olevien rajapintojen lisäksi konseptissa on suunniteltu valmiit liitännät yleisimpien myynti- ja varastojärjestelmien kanssa. Valmiina kokonaisratkaisuna konsepti tarjoaa integraation Odoo-toiminnanohjausjärjestelmän kanssa.

DigiVaate- tuotehallintasovelluksessa voidaan suunnitella mallisto- ja tuotekokonaisuuksia sekä luoda sesonki- ja mallistokohtaisia budjetteja ja asettaa katetavoitteet. Itse tuotehallintaan kuuluu tuotteiden, kokolajitelmien, värien ja materiaalien hallinta. Käyttöliittymään kuuluu myös tuotteiden seulonta mm. malliston ja tuotteen ominaisuuksien perusteella.

Tuotteeseen voi lisätä valmistusmäärät, valmistuskustannukset sekä materiaalin kulutukset ja kustannukset. Nämä siirtyvät budjettiin, jonka toteutumista voidaan peilata tavoitebudjettiin. Toimitusketjunhallintaohjelmiin yhdistettynä järjestelmän on tarkoitus valvoa budjetin ja katetavoitteen toteutumista mallistonluontiprosessin aikana ja hälyttää budjettiylityksistä ja muista kriittisistä poikkeamista.

Hanke päättyi 31.1.2019. Hanketta rahoitti Euroopan aluekehitysrahasto (EAKR) ja Uudenmaanliitto. Yhteydenotot: digivaate (at) metropolia.fi

## Osa-alueet
DigiVaate-sovelluksen tietosisältö jäsentyy seuraaviin vaatetus- ja muotialan pk-yrityksen tuotehallinta- ja valikoimasuunnittelun käsitteisiin ja koostuu niihin liittyvistä tiedoista:

- Yritys
- Tuotteet ja niiden ryhmittely
- Tuotevalikoimat (sesongeittain, asiakkaittain)
- Yleiset tuotteeseen liitettävät attribuutit (väri, kuosi, materiaali, koko)
- Budjetti

Tietosisällössä ei ole mukana käyttäjähallintaan liittyviä osia, ne jätetään tulevan järjestelmän suunnitteluvaiheessa määriteltäviksi. Näitä ovat:

- Yksilöivä tunniste
- Käsitteen / tiedon luontiaika (pvm ja kellonaika)
- Käsitteen / tiedon päivitysaika (pvm ja kellonaika)

## Pyörittäminen
Severin pohjana toimii Node.js. Tietokantana oletusarvoisesti käytetään PostgreSQL-tietokantaa, mutta Sequelize ORM kirjasto tukee myös muitakin SQL-tietokantoja. Tietokanta yhteyttä varten on määrittely tiedosto **databaseConfig.json**.

Salausta varten ympäristömuuttujiin on asetettava **JWT_KEY ympäristömuuttuja**, jolla salataan avaimia. Esim. JWT_KEY=SaLaInEnSalAUSavAIn.

Tuotanto version voi asettaa pyörimään suorittamalla ensin komennon **npm run build** ja sitten **npm run start**. Kehitys versio saa pyörimään komennolla **npm run dev**.

Kun serveri on pyörimässä. Osoitteesta **\<osoite\>/admin** (esim. localhost:3000/admin) voi kirjautua admin tunnuksilla ja luoda yhtiöitä. Tiedostoon **admin.json** voi asettaa tunnukset admin käyttäjälle. Oletusarvoisesti käyttäjänimi on admin ja salasana admin.

Kun admin tunnuksilla on luotu yhtiöitä. Näille yhtiön sovellukseen voi kirjautua pääsivulta ja alkaa käyttämään sovellusta.
