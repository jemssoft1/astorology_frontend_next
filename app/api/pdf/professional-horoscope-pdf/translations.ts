// translations.ts — Re-exports translations from basic-horoscope-pdf
// Professional PDF uses the same translation dictionaries for planet/zodiac/nakshatra names

export {
  translatePlanet,
  translateSign as translateZodiac,
  translateNakshatra,
  translateDay,
  translateYogini as translateYoginiDasha,
  translateTerm,
  translateValue,
} from "../basic-horoscope-pdf/translations";
