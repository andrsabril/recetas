export const useFormatter = () => {

    const removeDiacritics = (text: string) => {
        return text
          .replace(/ñ/g, 'nh')
          .normalize("NFD")
          .replace(/[\u0300-\u036f]/g, "");
    };
    const formatToLink = (page:string, context:string) => {
        const normalizedPage = removeDiacritics(page);
        const filterProp = normalizedPage.toLowerCase().replace(/\s/g, "-");
        const contextProp = context
        return (contextProp) ? `${contextProp}/${filterProp}` : `${filterProp}`;
    };

    const formatToText = (page:string) => {
        const filterProp = (page.charAt(0).toUpperCase() + page.slice(1)).replace(/-/g, " ");
        return filterProp;
    };

    return { formatToLink, formatToText }
};