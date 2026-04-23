import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

/*
 * Tests del drawer de detalle y descarga de certificado (Fase 5.2).
 *
 * Cubren: detalle muestra campos comunes, dni/legajo solo aparecen si vienen
 * en el DTO, el botón de certificado solo aparece si certificadoDescargable
 * es true, y los errores 403/404 muestran mensajes específicos al usuario.
 */

const { getDetalleMock, descargarMock } = vi.hoisted(() => ({
  getDetalleMock: vi.fn(),
  descargarMock: vi.fn(),
}));

vi.mock('../api/consulta.ts', () => ({
  getFormacionDetalle: getDetalleMock,
  descargarCertificado: descargarMock,
  ejecutarConsulta: vi.fn(),
}));

import { FormacionDetalleDrawer } from '../components/FormacionDetalleDrawer.tsx';
import { ApiError } from '../api/http.ts';

const detalleBase = {
  id: 42,
  tipoFormacion: 'militar',
  apellidoNombre: 'Gómez, Ana',
  grado: 'Capitán',
  unidad: 'Unidad B',
  tieneDocumentacion: true,
  certificadoDescargable: true,
  estadoVigencia: 'vigente',
  fechaObtencion: '2024-05-10',
};

beforeEach(() => {
  getDetalleMock.mockReset();
  descargarMock.mockReset();
});

describe('FormacionDetalleDrawer — render', () => {
  it('muestra campos comunes del detalle', async () => {
    getDetalleMock.mockResolvedValueOnce({ ...detalleBase, dni: '20111222', legajo: 'L-042' });

    render(<FormacionDetalleDrawer formacionId={42} onClose={() => undefined} />);

    expect(await screen.findByText(/Gómez, Ana/)).toBeInTheDocument();
    expect(screen.getByText(/Capitán/)).toBeInTheDocument();
    expect(screen.getByText(/Unidad B/)).toBeInTheDocument();
  });

  it('dni y legajo solo se renderizan si vienen en el DTO', async () => {
    getDetalleMock.mockResolvedValueOnce({ ...detalleBase, dni: '20111222', legajo: 'L-042' });
    const conDatos = render(
      <FormacionDetalleDrawer formacionId={42} onClose={() => undefined} />,
    );
    expect(await conDatos.findByText('20111222')).toBeInTheDocument();
    expect(conDatos.getByText('L-042')).toBeInTheDocument();
    conDatos.unmount();

    getDetalleMock.mockResolvedValueOnce({ ...detalleBase });
    const sinDatos = render(
      <FormacionDetalleDrawer formacionId={43} onClose={() => undefined} />,
    );
    await sinDatos.findByText(/Gómez, Ana/);
    expect(sinDatos.queryByText('20111222')).not.toBeInTheDocument();
    expect(sinDatos.queryByText('L-042')).not.toBeInTheDocument();
  });
});

describe('FormacionDetalleDrawer — botón de certificado', () => {
  it('aparece solo si certificadoDescargable === true', async () => {
    getDetalleMock.mockResolvedValueOnce({ ...detalleBase, certificadoDescargable: true });
    render(<FormacionDetalleDrawer formacionId={42} onClose={() => undefined} />);
    expect(await screen.findByRole('button', { name: /descargar certificado/i })).toBeInTheDocument();
  });

  it('no aparece si certificadoDescargable === false', async () => {
    getDetalleMock.mockResolvedValueOnce({ ...detalleBase, certificadoDescargable: false });
    render(<FormacionDetalleDrawer formacionId={42} onClose={() => undefined} />);
    await screen.findByText(/Gómez, Ana/);
    expect(screen.queryByRole('button', { name: /descargar certificado/i })).not.toBeInTheDocument();
    expect(screen.getByText(/no hay certificado disponible/i)).toBeInTheDocument();
  });
});

describe('FormacionDetalleDrawer — errores de descarga', () => {
  it('error 403 muestra mensaje de permiso', async () => {
    getDetalleMock.mockResolvedValueOnce({ ...detalleBase, certificadoDescargable: true });
    descargarMock.mockRejectedValueOnce(new ApiError('Permiso insuficiente', 403));

    render(<FormacionDetalleDrawer formacionId={42} onClose={() => undefined} />);
    const btn = await screen.findByRole('button', { name: /descargar certificado/i });
    const user = userEvent.setup();
    await user.click(btn);

    await waitFor(() =>
      expect(screen.getByText(/no tenés permiso para descargar/i)).toBeInTheDocument(),
    );
  });

  it('error 404 muestra mensaje de certificado no disponible', async () => {
    getDetalleMock.mockResolvedValueOnce({ ...detalleBase, certificadoDescargable: true });
    descargarMock.mockRejectedValueOnce(new ApiError('No encontrado', 404));

    render(<FormacionDetalleDrawer formacionId={42} onClose={() => undefined} />);
    const btn = await screen.findByRole('button', { name: /descargar certificado/i });
    const user = userEvent.setup();
    await user.click(btn);

    await waitFor(() =>
      expect(screen.getByText(/no hay certificado disponible para esta formación/i)).toBeInTheDocument(),
    );
  });
});
