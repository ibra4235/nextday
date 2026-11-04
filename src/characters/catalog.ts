import { ImageSourcePropType } from 'react-native';

export type Character = {
  id: string;
  tr: string;
  en: string;
  color: string;
  image: ImageSourcePropType;
};

export const CHARACTERS: readonly Character[] = [
  { id: '01', tr: 'Zeynep', en: 'Olivia', color: '#C4897B', image: require('../../assets/characters/01-gul.jpg') },
  { id: '02', tr: 'Elif', en: 'Emma', color: '#B7A0D8', image: require('../../assets/characters/02-lila.jpg') },
  { id: '03', tr: 'Defne', en: 'Charlotte', color: '#F3EFE6', image: require('../../assets/characters/03-inci.jpg') },
  { id: '04', tr: 'Asel', en: 'Amelia', color: '#E36A58', image: require('../../assets/characters/04-mercan.jpg') },
  { id: '05', tr: 'Miray', en: 'Sophia', color: '#7DCA9A', image: require('../../assets/characters/05-nane.jpg') },
  { id: '06', tr: 'Eylül', en: 'Ava', color: '#E0A12A', image: require('../../assets/characters/06-kehribar.jpg') },
  { id: '07', tr: 'Azra', en: 'Mia', color: '#D23B4A', image: require('../../assets/characters/07-kiraz.jpg') },
  { id: '08', tr: 'Nehir', en: 'Luna', color: '#C5CED6', image: require('../../assets/characters/08-gumus.jpg') },
  { id: '09', tr: 'Ada', en: 'Harper', color: '#F0B89A', image: require('../../assets/characters/09-seftali.jpg') },
  { id: '10', tr: 'Asya', en: 'Evelyn', color: '#3C348F', image: require('../../assets/characters/10-gece.jpg') },
  { id: '11', tr: 'Yusuf', en: 'Liam', color: '#8B1E24', image: require('../../assets/characters/11-kor.jpg') },
  { id: '12', tr: 'Emir', en: 'Noah', color: '#24315C', image: require('../../assets/characters/12-lacivert.jpg') },
  { id: '13', tr: 'Aras', en: 'Oliver', color: '#8D6A3A', image: require('../../assets/characters/13-bronz.jpg') },
  { id: '14', tr: 'Kerem', en: 'James', color: '#4E5358', image: require('../../assets/characters/14-komur.jpg') },
  { id: '15', tr: 'Ömer', en: 'Elijah', color: '#2F8A45', image: require('../../assets/characters/15-orman.jpg') },
  { id: '16', tr: 'Poyraz', en: 'Lucas', color: '#8FD0E0', image: require('../../assets/characters/16-buz.jpg') },
  { id: '17', tr: 'Deniz', en: 'Henry', color: '#E2B431', image: require('../../assets/characters/17-altin.jpg') },
  { id: '18', tr: 'Ayaz', en: 'Jack', color: '#C47A45', image: require('../../assets/characters/18-bakir.jpg') },
  { id: '19', tr: 'Çınar', en: 'Leo', color: '#1E8A62', image: require('../../assets/characters/19-zumrut.jpg') },
  { id: '20', tr: 'Karan', en: 'Owen', color: '#6D7380', image: require('../../assets/characters/20-firtina.jpg') },
];
