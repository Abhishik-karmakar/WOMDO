export function createContent(brand, extract) {
  return `can you tell on the scale of 10 how the person in this text is rating product named ${brand}: \n ${extract} I just want rating on the scale of 10 from you. The result should be only this -> Rating: {Rating}`;
}
