# Backend APIs Used in PDF Generation (`app/api/pdf/`)

This document lists all the backend API endpoints consumed by the various PDF generation routes (from `${BASE_URL}/api/...`).

## Vedic Astrology Reports

### Common Endpoints

Used by **basic-horoscope-pdf**, **match-making-pdf**, **mini-horoscope-pdf**, and **professional-horoscope-pdf**:

- `/api/birth_details`
- `/api/astro_details`
- `/api/planets`
- `/api/planets/extended`
- `/api/major_vdasha`
- `/api/current_vdasha`
- `/api/general_ascendant_report`
- `/api/ghat_chakra`
- `/api/panchang`
- `/api/horo_chart/D1`, `/api/horo_chart/D9`, `/api/horo_chart/MOON`, `/api/horo_chart/chalit`
- `/api/manglik`
- `/api/current_vdasha_all` (Basic, Match-Making, Professional)

### Basic & Professional Horoscope Additions

- `/api/horo_chart/D2` ... `/api/horo_chart/D12`, `/api/horo_chart/SUN`
- `/api/kp_house_cusps`
- `/api/simple_manglik`
- `/api/major_yogini_dasha`, `/api/sub_yogini_dasha`, `/api/current_yogini_dasha`
- `/api/numero_table`, `/api/numero_report`, `/api/numero_fav_time`, `/api/numero_fav_lord`, `/api/numero_fav_mantra`
- `/api/kalsarpa_details`
- `/api/sadhesati_current_status`
- `/api/basic_gem_suggestion`

### Professional Horoscope Exclusive

- `/api/horo_chart/D16` ... `/api/horo_chart/D60`
- `/api/kp_planets`, `/api/kp_birth_chart`
- `/api/sadhesati_life_details`
- `/api/planetary_friendship`
- `/api/general_house_report/{planet}`
- `/api/rudraksha_suggestion`
- `/api/sarvashtak`, `/api/planet_ashtak/{planet}`
- `/api/major_chardasha`, `/api/current_chardasha`, `/api/sub_chardasha/{sign}`

### Mini Horoscope Exclusive

- `/api/sub_vdasha/{planet}`

---

## Western Astrology Reports

### Common Tropical Endpoints

Used by **synastry-english-pdf**, **western-life-forecast-pdf**, **western-natal-horoscope-pdf**, and **solar-return-english-pdf**:

- `/api/planets/tropical`
- `/api/house_cusps/tropical`
- `/api/natal_wheel_chart`

### Western Life Forecast Exclusive

- `/api/tropical_transits/monthly`

### Western Natal Horoscope Exclusive

- `/api/western_chart_data`
- `/api/western_horoscope`
- `/api/natal_chart_interpretation`
- `/api/general_ascendant_report/tropical`
- `/api/general_sign_report/tropical/{planet}`
- `/api/general_house_report/tropical/{planet}`

### Solar Return Exclusive

- `/api/solar_return_details`
- `/api/solar_return_planets`
- `/api/solar_return_house_cusps`
- `/api/solar_return_planet_aspects`

---

## Horoscope PDF (`horoscope-pdf`)

This route delegates its data fetching to `lib/horoscopeApi.ts`, which calls multiple endpoints under the `/api/Calculate/` namespace:

- `/api/Calculate/LocalMeanTime/...`
- `/api/Calculate/AyanamsaDegree/...`
- `/api/Calculate/YoniKutaAnimal/...`
- `/api/Calculate/MarakaPlanetList/...`
- `/api/Calculate/LagnaSignName/...`
- `/api/Calculate/MoonSignName/...`
- `/api/Calculate/MoonConstellation/...`
- `/api/Calculate/SunsetTime/...`
- `/api/Calculate/NithyaYoga/...`
- `/api/Calculate/Karana/...`
- `/api/Calculate/DayDurationHours/...`
- `/api/Calculate/IsDayBirth/...`
- `/api/Calculate/LunarDay/...`
- `/api/Calculate/BirthVarna/...`
- `/api/Calculate/HoraAtBirth/...`
- `/api/Calculate/DayOfWeek/...`
- `/api/Calculate/LordOfWeekday/...`
- `/api/Calculate/ShubKartariPlanets/...`
- `/api/Calculate/PaapaKartariPlanets/...`
- `/api/Calculate/ShubKartariHouses/...`
- `/api/Calculate/PaapaKartariHouses/...`
- `/api/Calculate/KujaDosaScore/...`
- `/api/Calculate/PanchaPakshiBirthBird/...`
- `/api/Calculate/AllPlanetData/PlanetName/All/...`
- `/api/Calculate/AllHouseData/HouseName/All/...`
- `/api/Calculate/SarvashtakavargaChart/...`
- `/api/Calculate/BhinnashtakavargaChart/...`
- `/api/Calculate/PlanetShadbalaPinda/PlanetName/All/...`
- `/api/Calculate/HouseStrength/HouseName/All/...`
- `/api/Calculate/HoroscopePredictions/...`
- `/api/Calculate/AvakhadaChakra/...`
- `/api/Calculate/NavamsaChart/...`
- `/api/Calculate/MajorVimshottariDasha/...`
- `/api/Calculate/GeneralAscendantReport/...`

---

## Life Transit Report PDF (`life-transit-report-pdf`)

Currently uses placeholder fallback data in the code directly; it does not invoke any backend API endpoints directly during its execution, but typically it would use the standard Tropical Transit APIs if fully implemented.
