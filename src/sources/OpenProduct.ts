import * as z from 'zod';
import { Source, SourceConfig } from '../core/Source';
import { SourceFetchError, SourceParseError } from '../errors';
import { IssuanceEvent } from '../schemas.js';

export const StatusEnum = z.enum([
  'initieel',
  'in_aanvraag',
  'gereed',
  'actief',
  'ingetrokken',
  'geweigerd',
  'verlopen',
]);

export const FrequentieEnum = z.enum(['eenmalig', 'maandelijks', 'jaarlijks']);

export const ToegestaneStatussenEnum = z.enum([
  'initieel',
  'in_aanvraag',
  'gereed',
  'actief',
  'ingetrokken',
  'geweigerd',
  'verlopen',
]);

export const EigenaarSchema = z.object({
  uuid: z.uuid(),
  bsn: z.preprocess(
    (val) => (val === '' ? undefined : val),
    z.string().optional(),
  ),
  kvk_nummer: z.preprocess(
    (val) => (val === '' ? undefined : val),
    z.string().optional(),
  ),
  vestigingsnummer: z.preprocess(
    (val) => (val === '' ? undefined : val),
    z.string().max(24).optional(),
  ),
  klantnummer: z.preprocess(
    (val) => (val === '' ? undefined : val),
    z.string().max(50).optional(),
  ),
});

export const NestedDocumentSchema = z.object({
  uuid: z.uuid(),
  url: z.url().nullable().optional(),
  urn: z.string().nullable().optional(),
});

export const NestedZaakSchema = z.object({
  uuid: z.uuid(),
  url: z.url().nullable().optional(),
  urn: z.string().nullable().optional(),
});

export const NestedTaakSchema = z.object({
  uuid: z.uuid(),
  url: z.url().nullable().optional(),
  urn: z.string().nullable().optional(),
});

export const NestedProductTypeSchema = z.object({
  uuid: z.uuid(),
  code: z.string().max(255),
  keywords: z.array(z.string().max(100)).optional(),
  uniforme_product_naam: z.string(),
  toegestane_statussen: z.array(ToegestaneStatussenEnum).optional(),
  gepubliceerd: z.boolean().optional(),
  publicatie_start_datum: z.string().nullable().optional(),
  publicatie_eind_datum: z.string().nullable().optional(),
  aanmaak_datum: z.iso.datetime({ offset: true }).optional(),
  update_datum: z.iso.datetime({ offset: true }).optional(),
});

export const ProductSchema = z.object({
  uuid: z.uuid(),
  url: z.url(),
  naam: z.string().max(255),
  start_datum: z.string().nullable().optional(),
  eind_datum: z.string().nullable().optional(),
  aanmaak_datum: z.iso.datetime({ offset: true }),
  update_datum: z.iso.datetime({ offset: true }),
  producttype: NestedProductTypeSchema,
  gepubliceerd: z.boolean().optional(),
  eigenaren: z.array(EigenaarSchema),
  documenten: z.array(NestedDocumentSchema).optional(),
  zaken: z.array(NestedZaakSchema).optional(),
  taken: z.array(NestedTaakSchema).optional(),
  status: StatusEnum.optional(),
  prijs: z.string().nullable().optional(),
  frequentie: z.preprocess(
    (val) => (val === '' ? undefined : val),
    FrequentieEnum.nullable().optional(),
  ),
  verbruiksobject: z.record(z.string(), z.unknown()).nullable().optional(),
  dataobject: z.record(z.string(), z.unknown()).nullable().optional(),
  aanvraag_zaak_urn: z.string().nullable().optional(),
  aanvraag_zaak_url: z.url().nullable().optional(),
});

export type Product = z.infer<typeof ProductSchema>;
export type Eigenaar = z.infer<typeof EigenaarSchema>;
export type NestedProductType = z.infer<typeof NestedProductTypeSchema>;

export interface OpenProductConfig extends SourceConfig {
  readonly baseUrl: string;
  readonly apiToken: string;
}

export class OpenProduct extends Source<Product, OpenProductConfig> {
  constructor(config: OpenProductConfig) {
    super({ name: 'openproduct', config });
  }

  protected override onInit(): void {
    this.on('issuance', async (event) => {
      if (event.context.source !== this.name) return;
      await this.updateProduct(event);
    });
  }

  async updateProduct(event: IssuanceEvent): Promise<void> {
    // TODO, we have to update this to properly handle the issuance in the openproduct
    console.dir(
      `Updating product ${event.context.id} with session ID ${event.sessionId} with status ${event.status}`,
    );

    // TODO: remove after demo event
    if (process.env.OPENPRODUCT_WRITE_BACK_FEATURE_FLAG !== 'enabled') {
      console.warn('OpenProduct write-back is disabled. Skipping update.');
      return;
    }

    // Fetch the existing product to get the current dataobject
    const existing = await this.fetch(event.context.id);
    const existingDataobject = (existing.dataobject ?? {}) as Record<
      string,
      unknown
    >;

    // Patch
    await this.patch(event.context.id, {
      dataobject: {
        ...existingDataobject,
        issuanceEvents: [
          ...((existingDataobject.issuanceEvents as unknown[]) ?? []),
          {
            sessionId: event.sessionId,
            status: event.status,
            updatedAt: new Date().toISOString(),
          },
        ],
      },
    });
  }

  async patch(id: string, body: Record<string, unknown>): Promise<void> {
    const url = `${this.options.config.baseUrl}/producten/${id}`;

    const response = await fetch(url, {
      method: 'PATCH',
      headers: {
        'Authorization': `Token ${this.options.config.apiToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
      signal: AbortSignal.timeout(10_000),
    });

    if (!response.ok) {
      throw new SourceFetchError(response.status, response.statusText);
    }
  }

  async fetch(id: string): Promise<Product> {
    const url = `${this.options.config.baseUrl}/producten/${id}`;

    const response = await fetch(url, {
      headers: {
        Authorization: `Token ${this.options.config.apiToken}`,
        Accept: 'application/json',
      },
      signal: AbortSignal.timeout(10_000),
    });

    if (!response.ok) {
      throw new SourceFetchError(response.status, response.statusText);
    }

    try {
      const data = await response.json();
      return ProductSchema.parse(data);
    } catch (error) {
      console.error('Failed to parse response', error);
      throw new SourceParseError(error);
    }
  }
}
