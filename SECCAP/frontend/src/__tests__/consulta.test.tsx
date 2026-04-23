import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

/*
 * Tests de la pantalla de Consulta y filtros jerárquicos (Fase 5.2).
 *
 * Cubren: render del filtro raíz, no se puede buscar sin tipo_formacion,
 * el filtro raíz usa `codigo` (no `id`), al buscar se llama la API con
 * `page` y `page_size`, la respuesta usa `pageSize`, los filtros militares
 * y de idioma se limpian al cambiar el padre, y los resultados / paginación
 * se renderizan.
 */

const { ejecutarConsultaMock, getAptitudesMock, getInstitucionesMock, getTiposFormacionMock } = vi.hoisted(() => ({
  ejecutarConsultaMock: vi.fn(),
  getAptitudesMock: vi.fn(),
  getInstitucionesMock: vi.fn(),
  getTiposFormacionMock: vi.fn(),
}));

vi.mock('../api/consulta.ts', () => ({
  ejecutarConsulta: ejecutarConsultaMock,
  getFormacionDetalle: vi.fn(),
  descargarCertificado: vi.fn(),
}));

vi.mock('../api/catalogos.ts', () => ({
  getTiposFormacion: getTiposFormacionMock,
  getCategoriasMilitares: vi.fn().mockResolvedValue([
    { codigo: 'CM-01', nombre: 'Categoría 1' },
    { codigo: 'CM-02', nombre: 'Categoría 2' },
  ]),
  getAptitudes: getAptitudesMock,
  getIdiomas: vi.fn().mockResolvedValue([
    { nombre: 'Inglés' },
    { nombre: 'Francés' },
  ]),
  getNivelesIdioma: vi.fn().mockResolvedValue([
    { codigo: 'B2', nombre: 'B2' },
  ]),
  getInstituciones: getInstitucionesMock,
}));

import { ConsultaPage } from '../pages/ConsultaPage.tsx';

beforeEach(() => {
  ejecutarConsultaMock.mockReset();
  getAptitudesMock.mockReset();
  getInstitucionesMock.mockReset();
  getTiposFormacionMock.mockReset();
  getTiposFormacionMock.mockResolvedValue([
    { codigo: 'militar', nombre: 'Ámbito militar' },
    { codigo: 'idioma', nombre: 'Idioma' },
    { codigo: 'civil', nombre: 'Ámbito civil' },
  ]);
  getAptitudesMock.mockResolvedValue([{ nombre: 'Apt-A' }, { nombre: 'Apt-B' }]);
  getInstitucionesMock.mockResolvedValue([{ nombre: 'Cultural' }]);
});

describe('ConsultaPage — filtros básicos', () => {
  it('renderiza el filtro raíz tipo_formacion con codigos como value', async () => {
    render(<ConsultaPage />);
    const tipo = (await screen.findByLabelText(/tipo de formación/i)) as HTMLSelectElement;
    expect(tipo).toBeInTheDocument();

    // Confirmamos que las opciones llevan `codigo` y NO `id`.
    const opcionMilitar = Array.from(tipo.options).find((o) => o.textContent?.includes('militar'));
    expect(opcionMilitar?.value).toBe('militar');
    const opcionIdioma = Array.from(tipo.options).find((o) => o.textContent?.includes('Idioma'));
    expect(opcionIdioma?.value).toBe('idioma');
  });

  it('no permite buscar si no se eligió tipo_formacion', async () => {
    render(<ConsultaPage />);
    await screen.findByLabelText(/tipo de formación/i);
    const btn = screen.getByRole('button', { name: /buscar/i });
    expect(btn).toBeDisabled();
    expect(ejecutarConsultaMock).not.toHaveBeenCalled();
  });

  it('al buscar invoca la API con page y page_size, y renderiza items + paginación', async () => {
    ejecutarConsultaMock.mockResolvedValueOnce({
      items: [
        {
          id: 1,
          tipoFormacion: 'militar',
          apellidoNombre: 'Pérez, Juan',
          grado: 'Teniente',
          unidad: 'Unidad A',
          tieneDocumentacion: true,
          certificadoDescargable: true,
          estadoVigencia: 'vigente',
          fechaObtencion: '2024-05-10',
        },
      ],
      page: 1,
      pageSize: 5,
      total: 6,
    });

    render(<ConsultaPage />);
    const tipo = await screen.findByLabelText(/tipo de formación/i);
    const user = userEvent.setup();
    await user.selectOptions(tipo, 'militar');
    await user.click(screen.getByRole('button', { name: /buscar/i }));

    await waitFor(() => expect(ejecutarConsultaMock).toHaveBeenCalledTimes(1));
    const arg = ejecutarConsultaMock.mock.calls[0][0] as Record<string, unknown>;
    expect(arg).toMatchObject({
      tipo_formacion: 'militar',
      page: 1,
      page_size: 5,
    });

    expect(await screen.findByText(/Pérez, Juan/)).toBeInTheDocument();
    await waitFor(() => {
      const texto = document.body.textContent ?? '';
      expect(texto).toContain('Mostrando');
      expect(texto).toContain('de 6');
    });
    expect(screen.getByRole('button', { name: /página siguiente/i })).toBeEnabled();
  });
});

describe('ConsultaPage — filtros jerárquicos', () => {
  it('al cambiar categoria_militar limpia aptitud_capacitacion y recarga aptitudes', async () => {
    render(<ConsultaPage />);
    const tipo = await screen.findByLabelText(/tipo de formación/i);
    const user = userEvent.setup();
    await user.selectOptions(tipo, 'militar');

    const categoria = await screen.findByLabelText(/categoría militar/i);
    await user.selectOptions(categoria, 'CM-01');
    await waitFor(() => expect(getAptitudesMock).toHaveBeenCalledWith('CM-01'));

    // Selecciono aptitud
    const aptitud = (await screen.findByLabelText(/aptitud \/ capacitación/i)) as HTMLSelectElement;
    await waitFor(() =>
      expect(Array.from(aptitud.options).some((o) => o.value === 'Apt-A')).toBe(true),
    );
    await user.selectOptions(aptitud, 'Apt-A');
    expect(aptitud.value).toBe('Apt-A');

    // Cambio categoría → aptitud debe quedar vacía
    getAptitudesMock.mockResolvedValueOnce([{ nombre: 'Apt-X' }]);
    await user.selectOptions(categoria, 'CM-02');
    await waitFor(() => expect(aptitud.value).toBe(''));
    expect(getAptitudesMock).toHaveBeenLastCalledWith('CM-02');
  });

  it('al cambiar idioma limpia institucion y recarga instituciones', async () => {
    render(<ConsultaPage />);
    const tipo = await screen.findByLabelText(/tipo de formación/i);
    const user = userEvent.setup();
    await user.selectOptions(tipo, 'idioma');

    const idioma = await screen.findByLabelText(/^idioma$/i);
    await user.selectOptions(idioma, 'Inglés');
    await waitFor(() => expect(getInstitucionesMock).toHaveBeenCalledWith('Inglés'));

    const institucion = (await screen.findByLabelText(/institución/i)) as HTMLSelectElement;
    await waitFor(() =>
      expect(Array.from(institucion.options).some((o) => o.value === 'Cultural')).toBe(true),
    );
    await user.selectOptions(institucion, 'Cultural');
    expect(institucion.value).toBe('Cultural');

    getInstitucionesMock.mockResolvedValueOnce([{ nombre: 'Otra' }]);
    await user.selectOptions(idioma, 'Francés');
    await waitFor(() => expect(institucion.value).toBe(''));
    expect(getInstitucionesMock).toHaveBeenLastCalledWith('Francés');
  });

  it('cambiar tipo_formacion limpia resultados previos', async () => {
    ejecutarConsultaMock.mockResolvedValueOnce({
      items: [
        {
          id: 1,
          tipoFormacion: 'militar',
          apellidoNombre: 'Pérez, Juan',
          grado: 'Teniente',
          unidad: 'Unidad A',
          tieneDocumentacion: true,
          certificadoDescargable: false,
          estadoVigencia: 'vigente',
          fechaObtencion: '2024-05-10',
        },
      ],
      page: 1,
      pageSize: 5,
      total: 1,
    });

    render(<ConsultaPage />);
    const user = userEvent.setup();
    const tipo = await screen.findByLabelText(/tipo de formación/i);
    await user.selectOptions(tipo, 'militar');
    await user.click(screen.getByRole('button', { name: /buscar/i }));
    await screen.findByText(/Pérez, Juan/);

    await user.selectOptions(tipo, 'idioma');
    expect(screen.queryByText(/Pérez, Juan/)).not.toBeInTheDocument();
  });
});

describe('ConsultaPage — casos negativos', () => {
  it('si getTiposFormacion falla, muestra el mensaje de error del catálogo', async () => {
    getTiposFormacionMock.mockReset();
    getTiposFormacionMock.mockRejectedValueOnce(
      Object.assign(new Error('Error de red al cargar tipos'), { status: 500 }),
    );

    render(<ConsultaPage />);

    await waitFor(() => {
      expect(screen.getByText(/Error de red al cargar tipos/i)).toBeInTheDocument();
    });
    expect(screen.getByRole('button', { name: /buscar/i })).toBeDisabled();
  });

  it('si ejecutarConsulta rechaza con error del backend, muestra el banner "No se pudo realizar la consulta"', async () => {
    ejecutarConsultaMock.mockRejectedValueOnce(
      Object.assign(new Error('Error al consultar formaciones'), { status: 502 }),
    );

    render(<ConsultaPage />);
    const tipo = await screen.findByLabelText(/tipo de formación/i);
    const user = userEvent.setup();
    await user.selectOptions(tipo, 'militar');
    await user.click(screen.getByRole('button', { name: /buscar/i }));

    expect(
      await screen.findByText(/No se pudo realizar la consulta/i),
    ).toBeInTheDocument();
    expect(screen.getByText(/Error al consultar formaciones/i)).toBeInTheDocument();
    // No se renderizan resultados sensibles cuando hay error
    expect(screen.queryByRole('table')).not.toBeInTheDocument();
  });

  it('consulta sin resultados muestra el mensaje de vacío controlado', async () => {
    ejecutarConsultaMock.mockResolvedValueOnce({
      items: [],
      page: 1,
      pageSize: 5,
      total: 0,
    });

    render(<ConsultaPage />);
    const tipo = await screen.findByLabelText(/tipo de formación/i);
    const user = userEvent.setup();
    await user.selectOptions(tipo, 'militar');
    await user.click(screen.getByRole('button', { name: /buscar/i }));

    expect(
      await screen.findByText(/No se encontraron registros con los filtros seleccionados/i),
    ).toBeInTheDocument();
    expect(screen.queryByRole('table')).not.toBeInTheDocument();
  });
});
