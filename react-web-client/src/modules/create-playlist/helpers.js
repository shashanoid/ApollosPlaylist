export const _getTempoRange = tempo => {
  if (tempo >= 40 && tempo < 60) return [40, 60];
  else if (tempo >= 60 && tempo < 76) return [60, 66];
  else if (tempo >= 76 && tempo < 108) return [76, 108];
  else if (tempo >= 108 && tempo < 120) return [108, 120];
  else if (tempo >= 120 && tempo < 168) return [120, 168];
  else if (tempo >= 168 && tempo < 200) return [168, 200];
  else if (tempo >= 200) return [200, 1000];
  else return [40, 1000];
};
