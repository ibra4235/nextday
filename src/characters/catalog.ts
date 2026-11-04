import { ImageSourcePropType } from 'react-native';

export type Character = {
  id: string;
  tr: string;
  en: string;
  image: ImageSourcePropType;
};

export const CHARACTERS: readonly Character[] = [
  { id: '01', tr: 'Zeynep', en: 'Olivia', image: require('../../assets/characters/01-gul.jpg') },
  { id: '02', tr: 'Elif', en: 'Emma', image: require('../../assets/characters/02-lila.jpg') },
  { id: '03', tr: 'Defne', en: 'Charlotte', image: require('../../assets/characters/03-inci.jpg') },
  { id: '04', tr: 'Asel', en: 'Amelia', image: require('../../assets/characters/04-mercan.jpg') },
  { id: '05', tr: 'Miray', en: 'Sophia', image: require('../../assets/characters/05-nane.jpg') },
  { id: '06', tr: 'Eylül', en: 'Ava', image: require('../../assets/characters/06-kehribar.jpg') },
  { id: '07', tr: 'Azra', en: 'Mia', image: require('../../assets/characters/07-kiraz.jpg') },
  { id: '08', tr: 'Nehir', en: 'Luna', image: require('../../assets/characters/08-gumus.jpg') },
  { id: '09', tr: 'Ada', en: 'Harper', image: require('../../assets/characters/09-seftali.jpg') },
  { id: '10', tr: 'Asya', en: 'Evelyn', image: require('../../assets/characters/10-gece.jpg') },
  { id: '11', tr: 'Yusuf', en: 'Liam', image: require('../../assets/characters/11-kor.jpg') },
  { id: '12', tr: 'Emir', en: 'Noah', image: require('../../assets/characters/12-lacivert.jpg') },
  { id: '13', tr: 'Aras', en: 'Oliver', image: require('../../assets/characters/13-bronz.jpg') },
  { id: '14', tr: 'Kerem', en: 'James', image: require('../../assets/characters/14-komur.jpg') },
  { id: '15', tr: 'Ömer', en: 'Elijah', image: require('../../assets/characters/15-orman.jpg') },
  { id: '16', tr: 'Poyraz', en: 'Lucas', image: require('../../assets/characters/16-buz.jpg') },
  { id: '17', tr: 'Deniz', en: 'Henry', image: require('../../assets/characters/17-altin.jpg') },
  { id: '18', tr: 'Ayaz', en: 'Jack', image: require('../../assets/characters/18-bakir.jpg') },
  { id: '19', tr: 'Çınar', en: 'Leo', image: require('../../assets/characters/19-zumrut.jpg') },
  { id: '20', tr: 'Karan', en: 'Owen', image: require('../../assets/characters/20-firtina.jpg') },
];
