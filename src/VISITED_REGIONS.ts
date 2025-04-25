/**
 * 89 субъектов всего.
 *
 * Из них:
 *
 * Республики - 24
 * Края - 9
 * Автономные области - 1
 * Автономных округов - 4
 * Областей - 48
 * Города федерального значения - 3
 */

export const VISITED_REGIONS: Record<string, boolean> = {
  RU: true,
  'RU-MOW': true, // Москва
  'RU-SPE': true, // Санкт-Петербург
  'RU-SEV': true, // Севастополь (UA-40)
  'RU-KDA': true, // Краснодарский край
  'RU-PER': true, // Пермский край
  'RU-BEL': true, // Белгородская област
  'RU-VGG': true, // Волгоградская область
  'RU-LEN': true, // Ленинградская област
  'RU-MOS': true, // Московская область
  'RU-KGD': true, // Калининградская область
  'RU-MUR': true, // Мурманская область
  'RU-ME': true, // Республика Марий Эл
  'RU-TA': true, // Республика Татарстан
  'RU-NIZ': true, // Нижегородская область
  'RU-KRY': true, // Республика Крым (UA-43)
  'RU-VLA': true, // Вологодская область
  'RU-KR': true, // Республика Карелия
  UA: true,
  'UA-30': true, // Киевская область
  'UA-32': true, // Киев
  'UA-12': true, // Днепропетровская область
  'UA-63': true, // Харьковская область
  MV: true,
  AE: true,
  BE: true,
  TR: true,
  NL: true,
  FR: true,
  DE: true,
  PL: true,
  BY: true,
  'BY-HM': true, // Минск
  'BY-MI': true, // Минская область
};
