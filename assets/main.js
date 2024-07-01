formatDate(dateString) {
    if (dateString) {
      const date = new Date(dateString);
      return new Intl.DateTimeFormat('default', {dateStyle: 'long'}).format(date);
    } else {
      return '';
    }
  }