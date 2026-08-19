import { ChangeEvent } from "react";

type AutocompleteProps = {
  query: string;
  suggestions: string[];
  isValid: boolean;
  inp: number | null;
  isLoading: boolean;
  onQueryChange: (event: ChangeEvent<HTMLInputElement>) => void;
  onSuggestionSelect: (suggestion: string) => void;
};

export default function Autocomplete({ query, suggestions, isValid, inp, isLoading, onQueryChange, onSuggestionSelect }: AutocompleteProps) {
  return (
    <section className="autocomplete-panel" aria-label="Interacción de autocompletado">
      <div className="panel-heading">
        <div><p className="panel-kicker">Interacción real</p><h2>Búsqueda de temas</h2></div>
        <span className="inp-badge">Último INP {inp === null ? "--" : `${inp.toFixed(1)} ms`}</span>
      </div>
      <label htmlFor="topic-search">Busca un tema de JavaScript</label>
      <input id="topic-search" value={query} onChange={onQueryChange} placeholder="Prueba 'java' o 'web'" autoComplete="off" aria-describedby="validation-message" />
      <p id="validation-message" className={isValid ? "validation" : "validation invalid"}>
        {isValid ? "MICROTASK ejecutada: la validación está lista." : "Escribe al menos 2 caracteres."}
      </p>
      <div className="suggestions" aria-live="polite">
        {isLoading && <p>Task en cola: esperando respuesta del servidor...</p>}
        {!isLoading && query && suggestions.length === 0 && <p>No hay temas coincidentes.</p>}
        {suggestions.map((suggestion) => <button key={suggestion} onClick={() => onSuggestionSelect(suggestion)}>{suggestion}</button>)}
      </div>
    </section>
  );
}