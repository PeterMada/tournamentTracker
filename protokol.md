# :scroll: Scenár   

Webová aplikácia na zaznamenávanie a vyhodnocovanie výsledkov zápasov badmintonu. (inšpirácia https://www.vaseliga.cz)
Hlavnou úlohou tejto aplikácie je zaznamenávať výsledky jednotlivých zápasov.

Sezóna trvá 4 mesiace (jar, leto, jeseň, zima). Každý sezóna má 4 kolá (každý mesiac jedno kolo). Hráč musí odohrať každý mesiac všetky zápasy ktoré má v skupine. Na základe odohraných zápasov získava úroveň. Na základe tejto úrovne je priradený do skupiny. Každá úroveň má minimálne 4 účastníkov.  Na jednej úrovni môže byť viac skupín (napr.: úroveň 4. A a úroveň 4. B). 


**Štruktúra:** Web aplikácia

**Frontend:** React

**Backend:** Express

**Ukladanie dat:** PostgreSQL

**Nasadenie:** Heroku

**Kľúčové vlastnosti:**
- oddelený frontend a backend
- PostgreSQL
<br/><br/>

**:anchor:Podporované prehliadače**  <br/>
Posledné dve verzie  
✅ Google Chrome  
✅ Firefox  
✅ Microsoft Edge  
✅ Opera  
<br/><br/>

# :hammer: Požiadavky 

✅ oddelený frontend a backend (REST Api)  
⬜️ možnosť vytvárať časový harmonogram  
✅ pridávanie sútažiacich  
✅ pridávanie bodov za zápas  
⬜️ vytváranie tabuliek  
⬜️ export dát  
✅ ukladanie dát  
✅ dôraz na UX  
✅ jednoduché UI  
✅ dostupnosť (accessibility)  
✅ responzívnosť  
✅ dodržanie bežných štandardov  
✅ podpora pre najnovšie prehliadače
<br/><br/>

# :pushpin: Použité technológie  

###### PERN - stack
✅ PostgreSQL  
✅ Express  
✅ React  
✅ NodeJS  
✅ Heroku  
✅ Tailwind  
<br/><br/>

# :calendar: Časový harmonogram   

✅ Analýza a návrh (4h)  
✅ Zoznámenie sa s technologiami (3h)  
✅ Návrh DB (3h)  
✅ Príprava backendu (4h)  
✅ Priprava frontendu (4h)  
✅ Vytvorenie routes pre API (3h)  
✅ Prihlásnie a registrácia (3h)  
✅ Dashboard (3h)  
✅ Pridanie formulárov (3h)  
✅ Vyhodnocovanie dát (3h)  
⬜️ Refaktoring (3h)  
⬜️ Testovanie (2h)  
⬜️ Nasadenie (1h)  

<br/><br/>
<br/><br/>

# :crown: Analýza požiadaviek

## :memo: Nefunkcionálne požiadavky
- Spoľahlivosť
  - Dostupnosť systému
  - Miera poruchovosti
  - Pravdepodobnosť strát dát
  - Robustnosť systému
- Použiteľnosť
  - Doba zaškolenia
  - Intuitívnosť ovládania
  - Nápoveda
- Lokalizácia
  - Základný jazyk - angličtina
- Výkon
  - Doba odozvy
  - Lighthouse skóre
  - Počet súbežne pracujúcich 
- Konzistencia
  - Design systému
  - Konzistencia terminológie
- Rozhranie
 - Mobilné zobrazenie
 - Zobrazenie na desktopu

## :pencil: Funkcionálne požiadavky
**Registrácia** – do systému je možné sa zaregistrovať pomocou emailu a hesla.  
**Prihlásenie** – do systému je možné sa prihlásiť pomocou emailu a hesla.  
**Odhlásenie zo systému** - užívateľ má možnosť sa odhlásiť zo systému.  
**Zadanie skóre** – každý hráč môže v každom kole zadať skóre k svojim zápasom v skupine.  
**Zobrazenie skupiny** – hráč môže zobraziť svoju skupinu kde uvidí mená a emailové adresy ostatných hráčov v skupine.  
**Zobrazenie celkového skóre** – hráč si môže zobraziť tabuľku  aktuálneho poradia.  
**Vygenerovanie nového kola** – administrátor má možnosť vygenerovať nové kolo.  
**Generovanie nového kola systémom** – nové kolo generuje systém vždy na začiatku mesiaca.  
