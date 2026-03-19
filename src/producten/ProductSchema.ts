import * as z from 'zod';

export const StatusEnum = z.enum([
  'initieel',
  'in_aanvraag',
  'gereed',
  'actief',
  'ingetrokken',
  'geweigerd',
  'verlopen',
]);

export const FrequentieEnum = z.enum([
  'eenmalig',
  'maandelijks',
  'jaarlijks',
]);

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
  uuid: z.string().uuid(),
  bsn: z.string().optional(),
  kvk_nummer: z.string().length(8).optional(),
  vestigingsnummer: z.string().max(24).optional(),
  klantnummer: z.string().max(50).optional(),
});

export const NestedDocumentSchema = z.object({
  uuid: z.string().uuid(),
  url: z.string().url().nullable().optional(),
  urn: z.string().nullable().optional(),
});

export const NestedZaakSchema = z.object({
  uuid: z.string().uuid(),
  url: z.string().url().nullable().optional(),
  urn: z.string().nullable().optional(),
});

export const NestedTaakSchema = z.object({
  uuid: z.string().uuid(),
  url: z.string().url().nullable().optional(),
  urn: z.string().nullable().optional(),
});

export const NestedProductTypeSchema = z.object({
  uuid: z.string().uuid(),
  code: z.string().max(255),
  keywords: z.array(z.string().max(100)).optional(),
  uniforme_product_naam: z.string(),
  toegestane_statussen: z.array(ToegestaneStatussenEnum).optional(),
  gepubliceerd: z.boolean().optional(),
  publicatie_start_datum: z.string().nullable().optional(),
  publicatie_eind_datum: z.string().nullable().optional(),
  aanmaak_datum: z.string().datetime().optional(),
  update_datum: z.string().datetime().optional(),
});

export const ProductSchema = z.object({
  uuid: z.string().uuid(),
  url: z.string().url(),
  naam: z.string().max(255),
  start_datum: z.string().nullable().optional(),
  eind_datum: z.string().nullable().optional(),
  aanmaak_datum: z.string().datetime(),
  update_datum: z.string().datetime(),
  producttype: NestedProductTypeSchema,
  gepubliceerd: z.boolean().optional(),
  eigenaren: z.array(EigenaarSchema),
  documenten: z.array(NestedDocumentSchema).optional(),
  zaken: z.array(NestedZaakSchema).optional(),
  taken: z.array(NestedTaakSchema).optional(),
  status: StatusEnum.optional(),
  prijs: z.string().nullable().optional(),
  frequentie: FrequentieEnum.nullable().optional(),
  verbruiksobject: z.record(z.unknown()).nullable().optional(),
  dataobject: z.record(z.unknown()).nullable().optional(),
  aanvraag_zaak_urn: z.string().nullable().optional(),
  aanvraag_zaak_url: z.string().url().nullable().optional(),
});

export type Product = z.infer<typeof ProductSchema>;
export type Eigenaar = z.infer<typeof EigenaarSchema>;
export type NestedProductType = z.infer<typeof NestedProductTypeSchema>;
